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
const FOND = '#0a0a0c';
const BLANC = '#FFFFFF';
const GRIS = '#B1B1B1';
const POLICE = "'Segoe UI', 'DM Sans', Arial, Helvetica, sans-serif";

// Zone réservée à l'avatar LinkedIn (bas gauche) : rien d'important ici.
const X = 430;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Le tracé décoratif : une courbe montante, bleu virant à l'or. */
const COURBE =
  'M1090,336 L1160,306 L1230,318 L1300,264 L1370,280 L1440,214 L1510,232 L1584,168';

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fond" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#101014"/>
      <stop offset="60%" stop-color="${FOND}"/>
      <stop offset="100%" stop-color="#08080a"/>
    </linearGradient>
    <radialGradient id="orbeBleu" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${BLEU}" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="${BLEU}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orbeOr" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${OR}" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="${OR}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="trait" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${BLEU}" stop-opacity="0.15"/>
      <stop offset="65%" stop-color="${BLEU}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="${OR}" stop-opacity="1"/>
    </linearGradient>
    <pattern id="grille" width="44" height="44" patternUnits="userSpaceOnUse">
      <path d="M44 0 L0 0 0 44" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#fond)"/>
  <rect width="${W}" height="${H}" fill="url(#grille)"/>
  <ellipse cx="240" cy="60" rx="420" ry="300" fill="url(#orbeBleu)"/>
  <ellipse cx="1400" cy="360" rx="400" ry="280" fill="url(#orbeOr)"/>

  <!-- Courbe décorative, côté droit : elle évoque le métier sans l'illustrer. -->
  <path d="${COURBE}" fill="none" stroke="url(#trait)" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round" opacity="0.75"/>
  <circle cx="1584" cy="168" r="5" fill="${OR}"/>

  <!-- Pastille de disponibilité -->
  <g transform="translate(${X} 96)">
    <rect x="0" y="0" width="316" height="34" rx="17"
          fill="rgba(249,168,37,0.15)" stroke="#26262a" stroke-width="1.5"/>
    <circle cx="20" cy="17" r="4.5" fill="${OR}"/>
    <text x="36" y="23" font-family="${POLICE}" font-size="14" font-weight="700"
          letter-spacing="0.6" fill="${BLANC}">Disponible pour missions &amp; collaborations</text>
  </g>

  <!-- Nom -->
  <text x="${X}" y="186" font-family="${POLICE}" font-size="52" font-weight="800"
        letter-spacing="-1.4" fill="${BLANC}">Nathan Princer Diffo</text>

  <!-- Spécialités : le bleu porte l'action, l'or la valeur -->
  <text xml:space="preserve" x="${X}" y="228" font-family="${POLICE}" font-size="22" font-weight="700"
        letter-spacing="-0.2" fill="${BLEU}">Développeur FullStack<tspan fill="${GRIS}"> · </tspan><tspan fill="${BLEU}">Agents IA</tspan><tspan fill="${GRIS}"> · </tspan><tspan fill="${OR}">Créateur de SaaS</tspan></text>

  <!-- Preuve, pas promesse : ce qui est réellement en production -->
  <text x="${X}" y="272" font-family="${POLICE}" font-size="16" font-weight="500"
        fill="${GRIS}">De l’idée au produit en production — front, back, paiement Stripe et déploiement.</text>

  <!-- Pastilles techniques -->
  ${['React · TypeScript', 'Cloudflare Workers', 'FastAPI · Python', 'Stripe']
    .reduce((acc, t) => {
      const l = t.length * 8.1 + 30;
      const g = `<g transform="translate(${acc.x} 296)">
        <rect x="0" y="0" width="${l}" height="30" rx="15" fill="rgba(255,255,255,0.04)" stroke="#26262a" stroke-width="1"/>
        <text x="${l / 2}" y="20" text-anchor="middle" font-family="${POLICE}" font-size="13"
              font-weight="600" fill="${GRIS}">${esc(t)}</text></g>`;
      return { x: acc.x + l + 10, out: acc.out + g };
    }, { x: X, out: '' }).out}

  <!-- Adresse : discrète, en bas à droite, hors de la zone d'avatar -->
  <text x="${W - 44}" y="358" text-anchor="end" font-family="${POLICE}" font-size="17"
        font-weight="700" fill="${BLANC}">diffonathan.github.io</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(join(DEST, 'banniere-linkedin.png'));
const m = await sharp(join(DEST, 'banniere-linkedin.png')).metadata();
console.log(`écrit : public/brand/banniere-linkedin.png — ${m.width}×${m.height}`);
