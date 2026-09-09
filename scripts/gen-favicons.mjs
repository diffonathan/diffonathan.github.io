/**
 * Icônes du portfolio — monogramme « ND », généré depuis une source unique.
 *
 * ── Pourquoi « ND » et pas la photo ─────────────────────────────────────────
 * Un onglet fait 16 px, soit 256 pixels en tout. Un visage y perd tout ce qui
 * le rend reconnaissable : à cette taille il devient une tache beige, et
 * l'onglet n'est plus repérable au milieu de vingt autres. Testé, comparé, et
 * écarté pour cette raison. La photo garde toute sa place là où elle est
 * grande — bloc « À propos », CV, LinkedIn.
 *
 * ── Pourquoi deux lettres et pas une ────────────────────────────────────────
 * Deux est le maximum lisible à 16 px, et « ND » distingue mieux qu'un « N »
 * seul, qui appartient à des milliers de sites.
 *
 * ── Pourquoi pas de bordure ─────────────────────────────────────────────────
 * L'ancienne icône portait un liseré de 2 px sur un cadre de 64 : à l'affichage
 * en 16 px, cette bordure mangeait près de 20 % de la largeur utile en pure
 * décoration. Le monogramme occupe désormais tout le cadre.
 *
 * Usage : npm run icons
 */
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ici = dirname(fileURLToPath(import.meta.url));
const PUB = join(ici, '..', 'public');

// Mêmes valeurs que le site, le CV et les lettres.
const BLEU = '#0781FE';

/**
 * La source unique. Tout le reste en découle — aucune icône n'est retouchée à
 * la main, sans quoi elles finissent par diverger.
 *
 * `textLength` fige la largeur du monogramme : sans lui, le rendu dépend de la
 * police disponible sur la machine, et l'icône changerait de proportions d'un
 * poste à l'autre.
 */
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${BLEU}"/>
  <text x="32" y="44" text-anchor="middle" textLength="46" lengthAdjust="spacingAndGlyphs"
        font-family="'Segoe UI', 'DM Sans', Arial, sans-serif"
        font-size="34" font-weight="800" letter-spacing="-2" fill="#ffffff">ND</text>
</svg>`;

writeFileSync(join(PUB, 'favicon.svg'), svg);

// Le SVG couvre les navigateurs actuels ; les PNG servent de repli et
// alimentent les onglets sur les systèmes qui ne lisent pas le vectoriel.
// `density` élevé : sharp rasterise le SVG à cette résolution AVANT de
// redimensionner, ce qui évite l'escalier sur les diagonales du « N ».
await sharp(Buffer.from(svg), { density: 512 }).resize(16, 16).png().toFile(join(PUB, 'favicon-16.png'));
const png32 = await sharp(Buffer.from(svg), { density: 512 }).resize(32, 32).png().toBuffer();
writeFileSync(join(PUB, 'favicon-32.png'), png32);

// favicon.ico — un ICO qui embarque le PNG 32×32. Certains agrégateurs et
// vieux navigateurs demandent /favicon.ico sans lire les balises <link>.
const ico = Buffer.alloc(22 + png32.length);
ico.writeUInt16LE(0, 0);                 // réservé
ico.writeUInt16LE(1, 2);                 // type : icône
ico.writeUInt16LE(1, 4);                 // nombre d'images
ico.writeUInt8(32, 6);                   // largeur
ico.writeUInt8(32, 7);                   // hauteur
ico.writeUInt8(0, 8);                    // palette
ico.writeUInt8(0, 9);                    // réservé
ico.writeUInt16LE(1, 10);                // plans
ico.writeUInt16LE(32, 12);               // bits par pixel
ico.writeUInt32LE(png32.length, 14);     // taille des données
ico.writeUInt32LE(22, 18);               // décalage
png32.copy(ico, 22);
writeFileSync(join(PUB, 'favicon.ico'), ico);

// Icônes d'application : écran d'accueil iOS, et tailles attendues d'un
// manifeste si le portfolio devient installable un jour.
for (const [fichier, taille] of [
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
]) {
  await sharp(Buffer.from(svg), { density: 1024 }).resize(taille, taille).png().toFile(join(PUB, fichier));
}

console.log('Icônes « ND » générées : favicon svg/16/32/ico, apple-touch 180, icon 192/512.');
