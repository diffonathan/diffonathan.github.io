/**
 * Bannière de couverture LinkedIn — 1584 × 396, thème sombre.
 *
 * ── Trois contraintes de format, souvent oubliées ───────────────────────────
 * 1. LinkedIn superpose la photo de profil EN BAS À GAUCHE de la bannière. Tout
 *    ce qui compte doit vivre à droite de cette zone, sinon le texte se
 *    retrouve caché par la photo elle-même.
 * 2. Les côtés sont rognés sur mobile. On garde une marge droite confortable.
 * 3. 1584 × 396 est la taille d'AFFICHAGE, pas celle du fichier à fournir.
 *    Rasterisé à 1×, chaque glyphe est étalé sur un écran à densité double puis
 *    recompressé par LinkedIn — le résultat paraît flou. On rend donc le SVG à
 *    2× (3168 × 792) en doublant la densité : librsvg rasterise le vectoriel à
 *    la bonne échelle, ce n'est pas un agrandissement après coup.
 *
 * ── Pourquoi sans couleur ───────────────────────────────────────────────────
 * La charte bleu/or vit déjà partout ailleurs — portfolio, carrousels, CV. Une
 * bannière est lue en deux secondes, souvent en petit : le contraste maximal y
 * vaut mieux qu'une identité colorée, et il tient sur n'importe quel écran, y
 * compris mal calibré.
 *
 * Le thème se change d'une ligne (`const C = THEMES.clair`), les deux jeux de
 * couleurs étant décrits ensemble plus bas.
 *
 * ── Pourquoi trois niveaux de texte ─────────────────────────────────────────
 * Le message d'origine tenait en une phrase de trente mots. Personne ne lit
 * trente mots sur une bannière. La hiérarchie répond à trois questions dans
 * l'ordre où le lecteur se les pose : QUOI, pour QUEL bénéfice, COMMENT.
 *
 * Usage  : node scripts/gen-banniere-linkedin.mjs
 * Sortie : public/brand/banniere-linkedin.png (3168 × 792, à téléverser tel quel)
 */
import sharp from 'sharp';
import { mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ici = dirname(fileURLToPath(import.meta.url));
const DEST = join(ici, '..', 'public', 'brand');
mkdirSync(DEST, { recursive: true });

const W = 1584;
const H = 396;

/**
 * Marge gauche du contenu.
 *
 * 452 px est le minimum imposé par LinkedIn : en deçà, la photo de profil —
 * superposée en bas à gauche — recouvre le début de chaque ligne.
 *
 * `DECALAGE` déplace tout le bloc vers la droite, en pourcentage de la largeur.
 * Il est exprimé ainsi plutôt qu'en pixels pour rester lisible : « 15 % vers la
 * droite » se comprend, « +238 px » demande de connaître la largeur. Le
 * contrôle de débordement plus bas vérifie que le bloc tient toujours.
 */
const DECALAGE = 0.05;
const X = 452 + Math.round(W * DECALAGE);
/** Marge droite : les bords sont rognés sur mobile. */
const MARGE_D = 90;
const UTILE = W - X - MARGE_D;

/**
 * Deux thèmes complets, et un seul interrupteur.
 *
 * Basculer à la main aurait supposé de retoucher six valeurs dispersées, dont
 * celles des pastilles — qui doivent s'inverser DANS l'autre sens que le reste :
 * sur fond sombre, une pastille pleine est claire, sinon elle disparaît.
 * L'oubli est garanti à la première bascule ; un objet par thème le rend
 * impossible.
 *
 * Les gris ne sont pas les mêmes d'un thème à l'autre : un gris qui se lit bien
 * sur blanc devient trop sombre sur noir. Ils sont choisis pour un contraste
 * équivalent, pas pour être l'inverse arithmétique l'un de l'autre.
 */
const THEMES = {
  clair: {
    fond: '#FFFFFF',
    titre: '#0A0A0A',
    sous: '#5A5A5F',
    moyens: '#0A0A0A',
    filet: '#D8D8DC',
    pastilleFond: '#0A0A0A',
    pastilleTexte: '#FFFFFF',
  },
  sombre: {
    fond: '#0A0A0C',
    titre: '#FFFFFF',
    sous: '#A6A6AD',
    moyens: '#FFFFFF',
    filet: '#2E2E34',
    pastilleFond: '#FFFFFF',
    pastilleTexte: '#0A0A0C',
  },
};

/** Le thème rendu. Passer à 'clair' suffit à tout inverser. */
const C = THEMES.sombre;

/**
 * Pile de polices. Segoe UI est présente sur Windows, DM Sans sur les postes
 * qui l'ont installée, Arial partout ailleurs — le rendu reste net dans les
 * trois cas parce qu'aucune n'est fantaisie.
 */
const POLICE = "'Segoe UI Semibold', 'Segoe UI', 'DM Sans', Arial, Helvetica, sans-serif";

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ────────────────────────────────────────────────────────────────────────────
 * LE MESSAGE — seule partie à modifier.
 *
 * Le texte d'origine : « Je digitalise les processus métier pour simplifier la
 * réalisation de tâches répétitives et complexes, construis des applications
 * web / mobile de nouvelle génération liées à des agents IA. »
 *
 * Trois choses en changent, et voici pourquoi :
 * - « de nouvelle génération » est retiré : la formule ne dit rien de
 *   vérifiable et n'apprend rien au lecteur. Ce qui frappe, c'est ce que
 *   l'outil FAIT.
 * - « agents IA » devient « agents IA qui lisent vos documents » : le terme
 *   seul est du jargon pour un directeur de pôle ; l'exemple le rend concret
 *   en quatre mots.
 * - la phrase unique devient trois niveaux : sur une bannière, une phrase de
 *   trente mots n'est jamais lue en entier.
 * ──────────────────────────────────────────────────────────────────────────── */
const MESSAGE = {
  titre: 'Je digitalise les processus métier',
  sous: 'Le travail répétitif et complexe, pris en charge par une application.',
  /* Deux lignes plutôt qu'une : tout mettre bout à bout donnerait une ligne
     de cent caractères, qu'on ne lit pas d'un coup d'œil. Le regroupement
     n'est pas arbitraire — la première ligne dit ce que je construis, la
     seconde ce que je mets en ligne et fais convertir. */
  moyens: [
    'Applications web et mobile  ·  Agents IA qui lisent vos documents',
    'Sites internet  ·  Tunnels de vente',
  ],
  /* Les coordonnées en pastilles cerclées, comme les technologies de
     l'ancienne bannière. Elles se lisent d'un coup d'œil et se distinguent
     du texte courant sans avoir besoin de couleur. */
  contacts: [
    'diffonathan.github.io',
    'github.com/diffonathan',
    'diffoprincer@gmail.com',
    '+212 660 179 871',
  ],
};

const STYLES = {
  titre: { taille: 46, poids: 700, ls: -0.8 },
  sous: { taille: 23, poids: 400, ls: 0 },
  moyens: { taille: 18, poids: 600, ls: 0.3 },
  pastille: { taille: 14, poids: 600, ls: 0.2 },
};

/**
 * Largeur réelle d'une ligne, par rendu puis rognage.
 *
 * Estimer une largeur au nombre de caractères revient à supposer que « i » et
 * « M » occupent la même place : au premier changement de texte, la ligne
 * déborde sans prévenir. Une poignée de rasterisations au démarrage suffit à
 * s'en passer, et permet d'avertir AVANT de produire une bannière tronquée.
 */
async function mesurer(texte, style) {
  const svg =
    `<svg width="3000" height="${Math.ceil(style.taille * 3)}" xmlns="http://www.w3.org/2000/svg">` +
    `<text x="20" y="${style.taille * 2}" font-family="${POLICE}" font-size="${style.taille}"` +
    ` font-weight="${style.poids}" letter-spacing="${style.ls}" fill="#000000">${esc(texte)}</text></svg>`;
  const { info } = await sharp(Buffer.from(svg)).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
  return info.width;
}

/**
 * Une pastille pleine : fond noir, texte blanc.
 *
 * L'inverse — fond transparent et bordure fine — se fondait dans la page :
 * les coordonnées avaient le même poids visuel que le texte courant, alors
 * qu'elles sont ce qu'on veut retenir. Pleines, elles se détachent nettement
 * et se lisent comme des boutons.
 *
 * `rx` vaut la moitié de la hauteur, ce qui donne des extrémités parfaitement
 * demi-circulaires plutôt qu'un rectangle aux angles adoucis. C'est la forme
 * qui distingue une étiquette d'un simple cadre.
 *
 * Pas de bordure : sur un aplat noir posé sur du blanc, un contour n'ajoute
 * rien et épaissit le bord d'un demi-pixel à la rasterisation.
 */
const HP = 30;          // hauteur d'une pastille
const PAD = 17;         // respiration horizontale de part et d'autre du texte
const ECART = 11;       // espace entre deux pastilles

const pastille = (texte, x, y, largeurTexte) => {
  const l = largeurTexte + PAD * 2;
  return (
    `<rect x="${x}" y="${y}" width="${l}" height="${HP}" rx="${HP / 2}" ry="${HP / 2}" ` +
    `fill="${C.pastilleFond}"/>` +
    `<text x="${x + l / 2}" y="${y + HP / 2 + 5}" text-anchor="middle" font-family="${POLICE}" ` +
    `font-size="${STYLES.pastille.taille}" font-weight="${STYLES.pastille.poids}" ` +
    `letter-spacing="${STYLES.pastille.ls}" fill="${C.pastilleTexte}">${esc(texte)}</text>`
  );
};

const ligne = (texte, y, style, couleur) =>
  `<text x="${X}" y="${y}" font-family="${POLICE}" font-size="${style.taille}"` +
  ` font-weight="${style.poids}" letter-spacing="${style.ls}" fill="${couleur}">${esc(texte)}</text>`;

/* ──────────────────────────────────────────────────────────────────────────── */
// Les pastilles sont posées à leur largeur RÉELLE, mesurée : une estimation au
// nombre de caractères décalerait toute la rangée au premier libellé modifié.
const largeurs = [];
for (const c of MESSAGE.contacts) largeurs.push(await mesurer(c, STYLES.pastille));

const rangee = (() => {
  let x = X;
  const morceaux = [];
  for (let i = 0; i < MESSAGE.contacts.length; i++) {
    morceaux.push(pastille(MESSAGE.contacts[i], x, 314, largeurs[i]));
    x += largeurs[i] + PAD * 2 + ECART;
  }
  return { svg: morceaux.join(''), fin: x - ECART };
})();

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${C.fond}"/>

  ${ligne(MESSAGE.titre, 146, STYLES.titre, C.titre)}
  ${ligne(MESSAGE.sous, 192, STYLES.sous, C.sous)}

  <!-- Filet de séparation : il distingue l'offre des moyens sans ajouter de
       couleur. Court, aligné sur le texte, pas sur toute la largeur. -->
  <rect x="${X}" y="224" width="86" height="2" fill="${C.filet}"/>

  ${ligne(MESSAGE.moyens[0], 262, STYLES.moyens, C.moyens)}
  ${ligne(MESSAGE.moyens[1], 290, STYLES.moyens, C.moyens)}
  ${rangee.svg}
</svg>`;

// Contrôle de débordement AVANT d'écrire : une ligne trop longue serait rognée
// par LinkedIn sur mobile, et on ne s'en apercevrait qu'une fois publiée.
let alerte = false;
const aControler = [
  ['titre', MESSAGE.titre, STYLES.titre],
  ['sous', MESSAGE.sous, STYLES.sous],
  ['moyens 1', MESSAGE.moyens[0], STYLES.moyens],
  ['moyens 2', MESSAGE.moyens[1], STYLES.moyens],
];
for (const [nom, texte, style] of aControler) {
  const l = await mesurer(texte, style);
  const ok = l <= UTILE;
  if (!ok) alerte = true;
  console.log(`  ${nom.padEnd(10)} ${String(l).padStart(4)} px / ${UTILE} disponibles  ${ok ? '' : '<-- TROP LONG'}`);
}
const largeurRangee = rangee.fin - X;
const rangeeOk = largeurRangee <= UTILE;
if (!rangeeOk) alerte = true;
console.log(`  pastilles  ${String(largeurRangee).padStart(4)} px / ${UTILE} disponibles  ${rangeeOk ? '' : '<-- TROP LONG'}`);

/**
 * Échelle de rasterisation.
 *
 * 72 est la densité SVG par défaut : `72 × ECHELLE` rend donc le vectoriel à
 * ECHELLE fois la taille d'affichage. Ce n'est PAS un agrandissement — chaque
 * glyphe est redessiné à la résolution finale, les courbes restent nettes.
 *
 * 4× plutôt que 2× : LinkedIn ré-encode systématiquement l'image reçue, et plus
 * la source est fine, meilleure est sa réduction. Le poids reste dérisoire face
 * au plafond de 8 Mo, un aplat uni se compressant presque gratuitement.
 *
 * `flatten` retire le canal alpha : le fond est opaque, l'alpha n'ajoute que du
 * poids et certains ré-encodeurs le gèrent mal sur les bords de texte.
 */
const ECHELLE = 4;

await sharp(Buffer.from(svg), { density: 72 * ECHELLE })
  .flatten({ background: C.fond })
  .png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })
  .toFile(join(DEST, 'banniere-linkedin.png'));

const chemin = join(DEST, 'banniere-linkedin.png');
const m = await sharp(chemin).metadata();
const ko = Math.round(statSync(chemin).size / 1024);
console.log(`
écrit : public/brand/banniere-linkedin.png`);
console.log(`  ${m.width}×${m.height} — ${ECHELLE}× la taille d'affichage · ${ko} Ko · ${m.channels} canaux`);
if (m.width !== W * ECHELLE) console.warn(`⚠ attendu ${W * ECHELLE} px de large.`);
if (ko > 7500) console.warn('⚠ proche du plafond LinkedIn de 8 Mo — baisser ECHELLE.');
if (alerte) console.warn('⚠ au moins une ligne dépasse la zone utile — raccourcis-la.');
