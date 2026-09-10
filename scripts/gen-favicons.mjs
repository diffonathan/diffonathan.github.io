/**
 * Icônes du portfolio — le visage de Nathan, généré depuis une source unique.
 *
 * ── Le choix, et ce qu'il coûte ─────────────────────────────────────────────
 * Un onglet fait 16 px, soit 256 pixels en tout. Le monogramme « ND » qui
 * occupait cette place était plus net et plus repérable au milieu de vingt
 * autres onglets — c'est un fait, mesuré en comparant les deux à taille réelle.
 * Le visage a été retenu quand même : ce site est personnel, et la cohérence
 * avec la barre de navigation, le carrousel LinkedIn et le CV vaut plus que la
 * lisibilité maximale d'une icône d'onglet.
 *
 * ── Ce qui a été essayé et écarté ───────────────────────────────────────────
 * - Le cadrage large de la barre (tête + épaules) : à 16 px le visage n'occupe
 *   plus qu'une poignée de pixels et devient illisible. Il faut cadrer BEAUCOUP
 *   plus serré ici que partout ailleurs.
 * - Un renfort de contraste (linear 1.4, -38) pour « sauver » les petites
 *   tailles : il vire la peau à l'orange et donne un visage artificiel. Le
 *   remède était pire que le mal ; les couleurs restent naturelles.
 * - Le masque circulaire : il coûte 21 % de la surface, donc des pixels de
 *   visage, pour un gain purement décoratif. L'image est carrée, pleine page.
 *
 * ── Pourquoi il n'y a plus de favicon.svg ───────────────────────────────────
 * Une photo n'est pas vectorisable. Or les navigateurs PRÉFÈRENT le SVG quand
 * il est déclaré : le laisser en place aurait affiché l'ancien monogramme et
 * rendu tout ce fichier sans effet. Le lien a été retiré de index.html.
 *
 * Usage : npm run icons
 */
import sharp from 'sharp';
import { existsSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ici = dirname(fileURLToPath(import.meta.url));
const PUB = join(ici, '..', 'public');
const SOURCE = join(PUB, 'profile.jpg');

if (!existsSync(SOURCE)) throw new Error(`Photo introuvable : ${SOURCE}`);

/**
 * Deux cadrages, sur une source de 800 x 800.
 *
 * `icone`  — très serré : front, yeux, bouche, menton. C'est le seul moyen que
 *            le visage reste lisible à 16 px, où chaque pixel compte.
 * `grande` — un peu d'air autour de la tête, pour les tailles où l'on n'est
 *            plus contraint (écran d'accueil iOS, manifeste d'application).
 */
const CADRAGES = {
  icone: { left: 236, top: 118, width: 330, height: 330 },
  grande: { left: 170, top: 60, width: 460, height: 460 },
};

/** Rend la photo à la taille demandée, sans retouche de couleur. */
const rendre = (cadrage, taille) =>
  sharp(SOURCE).extract(CADRAGES[cadrage]).resize(taille, taille, { fit: 'cover' });

// ── Onglet ────────────────────────────────────────────────────────────────
await rendre('icone', 16).png().toFile(join(PUB, 'favicon-16.png'));
const png32 = await rendre('icone', 32).png().toBuffer();
writeFileSync(join(PUB, 'favicon-32.png'), png32);

// favicon.ico — enveloppe le PNG 32x32. Certains agrégateurs et vieux
// navigateurs demandent /favicon.ico sans lire les balises <link>.
const ico = Buffer.alloc(22 + png32.length);
ico.writeUInt16LE(0, 0); // réservé
ico.writeUInt16LE(1, 2); // type : icône
ico.writeUInt16LE(1, 4); // nombre d'images
ico.writeUInt8(32, 6); // largeur
ico.writeUInt8(32, 7); // hauteur
ico.writeUInt8(0, 8); // palette
ico.writeUInt8(0, 9); // réservé
ico.writeUInt16LE(1, 10); // plans
ico.writeUInt16LE(32, 12); // bits par pixel
ico.writeUInt32LE(png32.length, 14); // taille des données
ico.writeUInt32LE(22, 18); // décalage
png32.copy(ico, 22);
writeFileSync(join(PUB, 'favicon.ico'), ico);

// ── Écran d'accueil et manifeste ──────────────────────────────────────────
for (const [fichier, taille] of [
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
]) {
  await rendre('grande', taille).png().toFile(join(PUB, fichier));
}

// ── La vignette de la barre de navigation ─────────────────────────────────
// Ronde ici, contrairement aux icônes : à 36 px on a la place, et un rond se
// lit comme une personne là où un carré se lit comme une application.
const AV = 144;
const carre = await rendre('grande', AV).png().toBuffer();
const masque = Buffer.from(
  `<svg width="${AV}" height="${AV}"><circle cx="${AV / 2}" cy="${AV / 2}" r="${AV / 2}" fill="#fff"/></svg>`,
);
await sharp(carre)
  .composite([{ input: masque, blend: 'dest-in' }])
  .png()
  .toFile(join(PUB, 'avatar.png'));

// L'ancien monogramme vectoriel doit disparaître : tant qu'il existe, un
// navigateur qui le trouverait l'afficherait de préférence à la photo.
const svg = join(PUB, 'favicon.svg');
if (existsSync(svg)) {
  rmSync(svg);
  console.log('  favicon.svg supprimé (le monogramme aurait primé sur la photo)');
}

console.log('Icônes générées depuis la photo : favicon 16/32/ico, apple-touch 180, icon 192/512, avatar 144.');
