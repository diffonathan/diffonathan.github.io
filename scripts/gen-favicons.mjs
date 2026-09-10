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
 * - Un cadrage très serré sur le visage, au motif qu'à 16 px chaque pixel
 *   compte : il coupe le haut du crâne et étouffe l'image à TOUTES les tailles.
 *   Le gain de lisibilité ne compensait pas. Voir le commentaire de CADRAGES.
 * - Un renfort de contraste (linear 1.4, -38) pour « sauver » les petites
 *   tailles : il vire la peau à l'orange et donne un visage artificiel. Le
 *   remède était pire que le mal ; les couleurs restent naturelles.
 * - Le masque circulaire sur les icônes d'onglet : il coûte 21 % de la surface,
 *   donc des pixels de visage. Elles ont des coins arrondis à 20 %, ce qui les
 *   fait lire comme une icône sans rogner autant. L'avatar de la barre, lui,
 *   est bien rond : à 36 px on a la place, et un rond se lit comme une personne.
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
 * Deux cadrages, sur une source de 800 x 800. La différence n'est pas
 * esthétique, elle vient de la taille d'affichage.
 *
 * `icone`  — 460 px : tête entière avec un peu d'air. Retenu après comparaison
 *            de quatre largeurs à taille réelle ; plus serré (330 px), il coupe
 *            le haut du crâne et étouffe l'image à toutes les tailles.
 * `avatar` — 565 px : tête et épaules, veste comprise. À 36 px dans la barre on
 *            a la place d'un vrai portrait, et il se lit mieux qu'un gros plan.
 *            C'est aussi le cadrage du portrait du carrousel LinkedIn.
 */
const CADRAGES = {
  icone: { left: 170, top: 60, width: 460, height: 460 },
  avatar: { left: 118, top: 55, width: 565, height: 565 },
};

/** Rend la photo à la taille demandée, sans retouche de couleur. */
const rendre = (cadrage, taille) =>
  sharp(SOURCE).extract(CADRAGES[cadrage]).resize(taille, taille, { fit: 'cover' });

/**
 * Coins arrondis, à 20 % du côté — comparé à 14 % (invisible à 16 px) et 28 %
 * (qui commence à rogner les joues). Le masque est appliqué APRÈS le
 * redimensionnement, sur la taille finale : arrondir avant puis réduire
 * produirait des coins baveux.
 */
const RAYON = 0.2;
const coinsArrondis = async (buf, taille) => {
  const masque = Buffer.from(
    `<svg width="${taille}" height="${taille}"><rect width="${taille}" height="${taille}" ` +
      `rx="${taille * RAYON}" ry="${taille * RAYON}" fill="#fff"/></svg>`,
  );
  return sharp(buf).composite([{ input: masque, blend: 'dest-in' }]).png().toBuffer();
};

// ── Onglet ────────────────────────────────────────────────────────────────
writeFileSync(join(PUB, 'favicon-16.png'), await coinsArrondis(await rendre('icone', 16).png().toBuffer(), 16));
const png32 = await coinsArrondis(await rendre('icone', 32).png().toBuffer(), 32);
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
// Volontairement CARRÉES : iOS et Android appliquent leur propre masque. Les
// arrondir ici produirait un double arrondi, avec des bords rongés.
for (const [fichier, taille] of [
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
]) {
  await rendre('icone', taille).png().toFile(join(PUB, fichier));
}

// ── La vignette de la barre de navigation ─────────────────────────────────
// Ronde ici, contrairement aux icônes : à 36 px on a la place, et un rond se
// lit comme une personne là où un carré se lit comme une application.
const AV = 144;
const carre = await rendre('avatar', AV).png().toBuffer();
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
