/**
 * Bannière de couverture LinkedIn — 1584 × 396, à la charte.
 *
 * Contrainte de format, souvent oubliée : LinkedIn superpose la photo de
 * profil EN BAS À GAUCHE de la bannière, et rogne les côtés sur mobile. Tout
 * ce qui compte doit donc vivre dans la bande centrale, à droite de la zone
 * réservée à l'avatar — sinon le nom se retrouve caché par sa propre photo.
 *
 * Usage : node scripts/gen-banniere-linkedin.mjs
 * Sortie : public/brand/banniere-linkedin.png
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ici = dirname(fileURLToPath(import.meta.url));
const DEST = join(ici, '..', 'public', 'brand');
mkdirSync(DEST, { recursive: true });

const W = 1584;
const H = 396;

// Charte : bleu = l'action, or = la valeur, fond nuit.
const BLEU = '#0781FE';
const OR = '#F9A825';
const BLANC = '#FFFFFF';
const GRIS = '#B1B1B1';
const GRIS_SOMBRE = '#63636A';
const POLICE = "'Segoe UI', 'DM Sans', Arial, Helvetica, sans-serif";

/** Marge gauche du contenu : au-delà de la zone d'avatar LinkedIn. */
const X = 452;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Pastille technique — largeur mesurée sur le texte, pas devinée. */
function pastille(x, y, texte, { or = false } = {}) {
  const l = Math.round(texte.length * 7.6 + 30);
  return {
    largeur: l,
    svg: `<g transform="translate(${x} ${y})">
      <rect x="0" y="0" width="${l}" height="29" rx="14.5"
            fill="${or ? 'rgba(249,168,37,0.10)' : 'rgba(255,255,255,0.035)'}"
            stroke="${or ? 'rgba(249,168,37,0.35)' : 'rgba(255,255,255,0.10)'}" stroke-width="1"/>
      <text x="${l / 2}" y="19.5" text-anchor="middle" font-family="${POLICE}"
            font-size="12.5" font-weight="600" letter-spacing="0.2"
            fill="${or ? OR : GRIS}">${esc(texte)}</text>
    </g>`,
  };
}

/** Rangée de pastilles, posées à la suite. */
function rangee(x, y, items) {
  let cx = x;
  let out = '';
  for (const it of items) {
    const p = pastille(cx, y, typeof it === 'string' ? it : it.t, { or: it.or });
    out += p.svg;
    cx += p.largeur + 9;
  }
  return out;
}

/** Courbe de valeur : montante, bleu virant à l'or, avec son aire. */
const COURBE =
  'M1046,352 L1112,326 L1178,338 L1244,292 L1310,306 L1376,246 L1442,262 L1508,196 L1584,214';

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fond" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stop-color="#121218"/>
      <stop offset="45%"  stop-color="#0a0a0c"/>
      <stop offset="100%" stop-color="#08080a"/>
    </linearGradient>
    <radialGradient id="orbeBleu">
      <stop offset="0%" stop-color="${BLEU}" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="${BLEU}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orbeOr">
      <stop offset="0%" stop-color="${OR}" stop-opacity="0.17"/>
      <stop offset="100%" stop-color="${OR}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="trait" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="${BLEU}" stop-opacity="0.10"/>
      <stop offset="60%"  stop-color="${BLEU}" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="${OR}"   stop-opacity="1"/>
    </linearGradient>
    <linearGradient id="aire" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${BLEU}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="${BLEU}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="barre" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${BLEU}"/>
      <stop offset="100%" stop-color="${OR}"/>
    </linearGradient>
    <!-- Nappe diagonale : de la profondeur sans motif repetitif. Un
         quadrillage donnait un air de gabarit plutot que de produit fini. -->
    <linearGradient id="nappe" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0%"   stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="52%"  stop-color="#ffffff" stop-opacity="0.028"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <!-- Vignette : ramene le regard au centre, ferme les bords. -->
    <radialGradient id="vignette">
      <stop offset="55%"  stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.45"/>
    </radialGradient>
    <filter id="lueur" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="7" result="f"/>
      <feMerge><feMergeNode in="f"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#fond)"/>
  <rect width="${W}" height="${H}" fill="url(#nappe)"/>
  <ellipse cx="300" cy="40"  rx="520" ry="330" fill="url(#orbeBleu)"/>
  <ellipse cx="1430" cy="380" rx="440" ry="300" fill="url(#orbeOr)"/>

  <rect width="${W}" height="${H}" fill="url(#vignette)"/>

  <!-- Liseré lumineux supérieur : la recette « verre » de la charte. -->
  <rect x="0" y="0" width="${W}" height="1" fill="rgba(255,255,255,0.10)"/>

  <!-- Courbe de valeur, à droite, avec son aire : plus de matière qu'un trait. -->
  <path d="${COURBE} L1584,396 L1046,396 Z" fill="url(#aire)"/>
  <path d="${COURBE}" fill="none" stroke="url(#trait)" stroke-width="2.6"
        stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="1508" cy="196" r="5.5" fill="${OR}" filter="url(#lueur)"/>

  <!-- Barre d'accent : structure le bloc de texte, bleu vers or. -->
  <rect x="${X - 26}" y="96" width="4" height="208" rx="2" fill="url(#barre)"/>

  <!-- Sur-titre -->
  <text xml:space="preserve" x="${X}" y="112" font-family="${POLICE}" font-size="13"
        font-weight="700" letter-spacing="2.6" fill="${OR}">CASABLANCA · REMOTE · DISPONIBLE</text>

  <!-- Nom : l'ancre visuelle -->
  <text x="${X}" y="176" font-family="${POLICE}" font-size="56" font-weight="800"
        letter-spacing="-1.8" fill="${BLANC}">Nathan Princer Diffo</text>

  <!-- Spécialités — le bleu porte l'action, l'or la valeur -->
  <text xml:space="preserve" x="${X}" y="216" font-family="${POLICE}" font-size="21"
        font-weight="700" letter-spacing="-0.2"
        fill="${BLEU}">Développeur FullStack<tspan fill="${GRIS_SOMBRE}"> · </tspan><tspan fill="${BLEU}">Concepteur d’agents IA</tspan><tspan fill="${GRIS_SOMBRE}"> · </tspan><tspan fill="${OR}">Créateur de SaaS</tspan></text>

  <!-- Preuve, pas promesse -->
  <text xml:space="preserve" x="${X}" y="252" font-family="${POLICE}" font-size="15.5"
        font-weight="500" fill="${GRIS}">Je conçois, développe et mets en production — front, back, paiement Stripe, déploiement.</text>

  ${rangee(X, 274, ['React · TypeScript', 'Cloudflare Workers', 'FastAPI · Python', 'Stripe', { t: 'SaaS en production', or: true }])}

  <!-- Contact : une seule ligne, alignée, hors zone d'avatar -->
  <text xml:space="preserve" x="${X}" y="340" font-family="${POLICE}" font-size="14.5"
        font-weight="600" fill="${GRIS}">diffonathan.github.io<tspan fill="${GRIS_SOMBRE}">   ·   </tspan><tspan fill="${GRIS}">+212 660 179 871</tspan><tspan fill="${GRIS_SOMBRE}">   ·   </tspan><tspan fill="${GRIS}">diffoprincer@gmail.com</tspan></text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(join(DEST, 'banniere-linkedin.png'));
const m = await sharp(join(DEST, 'banniere-linkedin.png')).metadata();
console.log(`écrit : public/brand/banniere-linkedin.png — ${m.width}×${m.height}`);
