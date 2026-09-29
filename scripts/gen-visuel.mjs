/**
 * Générateur de VISUELS LinkedIn — la bibliothèque de gabarits.
 *
 * ── Pourquoi ce fichier existe à côté de gen-carrousel.mjs ──────────────────
 * Le carrousel six diapos est un format long, qu'on ne publie pas tous les
 * jours. Publier quatre fois par jour avec un seul gabarit donne un profil
 * monotone : la même image revient, et le lecteur cesse de la voir.
 *
 * Ce générateur produit des visuels UNIQUES — une image, une idée — dans sept
 * compositions différentes qui partagent la même charte. Le lecteur reconnaît
 * la marque sans subir la répétition.
 *
 * ── Les sept gabarits ───────────────────────────────────────────────────────
 *   citation    une phrase forte en très grand, pour ce qui se retient
 *   chiffre     un nombre seul, énorme, et ce qu'il veut dire
 *   avantApres  deux panneaux opposés : le fichier d'un côté, l'outil de l'autre
 *   etapes      un parcours en 4 étapes reliées, pour montrer une méthode
 *   liste       5 points numérotés : un mini-guide qui tient en une image
 *   comparatif  un tableau à deux colonnes, pour aider à décider
 *   ecran       une interface stylisée et FICTIVE, pour montrer sans divulguer
 *
 * ── Contenu ─────────────────────────────────────────────────────────────────
 * scripts/visuels/<nom>.mjs exporte { fichier, visuels: [ { gabarit, ... } ] }.
 * Un fichier peut contenir un seul visuel ou toute une planche d'essai.
 *
 * Usage  : node scripts/gen-visuel.mjs <nom>
 * Sortie : brand/visuel/<nom>-NN.png  (une image par entrée)
 *
 * ── Règle de confidentialité, identique au carrousel ────────────────────────
 * Aucun nom de client, aucune donnée réelle, aucune capture d'un outil
 * existant. Le gabarit « ecran » dessine une interface inventée : c'est
 * précisément ce qui permet de montrer un savoir-faire sans rien divulguer.
 */
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import { existsSync, mkdirSync, readdirSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';

const ici = dirname(fileURLToPath(import.meta.url));
const RACINE = join(ici, '..');
const SORTIE = join(RACINE, 'brand', 'visuel');

/** Charte — mêmes valeurs que gen-carrousel.mjs. */
const C = {
  bleu: '#0781FE',
  or: '#F9A825',
  blanc: '#FFFFFF',
  fond: '#0A0A0C',
  fondClair: '#101014',
  fondProfond: '#08080A',
  gris: '#B1B1B1',
  grisSombre: '#63636A',
  bordure: '#26262A',
  // Le rouge sourd ne sert qu'à marquer « l'avant » : jamais un accent de marque.
  avant: '#8C4A4A',
};

const L = 1080;
const H = 1350;

const IDENTITE = {
  nom: 'Nathan Diffo',
  role: 'Développeur Full Stack · Digitalisation de processus',
  site: 'diffonathan.github.io',
};

/* ── La photo, découpée en rond et intégrée en base64 ─────────────────────── */
const CADRAGE = { left: 118, top: 55, width: 565, height: 565 };

async function photoRonde(taille) {
  const src = join(RACINE, 'public', 'profile.jpg');
  if (!existsSync(src)) throw new Error('Photo introuvable : ' + src);
  const carre = await sharp(src).extract(CADRAGE).resize(taille, taille).png().toBuffer();
  const masque = Buffer.from(
    '<svg width="' + taille + '" height="' + taille + '"><circle cx="' + taille / 2 +
      '" cy="' + taille / 2 + '" r="' + taille / 2 + '" fill="#fff"/></svg>',
  );
  const rond = await sharp(carre).composite([{ input: masque, blend: 'dest-in' }]).png().toBuffer();
  return 'data:image/png;base64,' + rond.toString('base64');
}

/* ────────────────────────────────────────────────────────────────────────────
 * LE STYLE
 *
 * Chaque gabarit a sa propre composition, mais tous partagent le fond, la
 * famille typographique et les deux accents. C'est ce qui fait qu'on reconnaît
 * le profil en défilant, même quand la forme change tous les jours.
 * ──────────────────────────────────────────────────────────────────────────── */
const style = `
  @page { size: ${L}px ${H}px; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', 'DM Sans', Arial, Helvetica, sans-serif; -webkit-font-smoothing: antialiased; }

  .visuel {
    position: relative; width: ${L}px; height: ${H}px; overflow: hidden;
    color: ${C.blanc}; page-break-after: always;
    background:
      radial-gradient(90% 90% at 12% 0%, rgba(7,129,254,0.14) 0%, rgba(7,129,254,0) 62%),
      radial-gradient(80% 80% at 88% 100%, rgba(249,168,37,0.11) 0%, rgba(249,168,37,0) 62%),
      linear-gradient(160deg, ${C.fondClair} 0%, ${C.fond} 60%, ${C.fondProfond} 100%);
    padding: 84px 84px 76px;
    display: flex; flex-direction: column;
  }

  /* L'en-tête complet : sur les gabarits où la personne compte autant que le
     propos (étapes, liste, comparatif, avant/après). */
  .entete { display: flex; align-items: center; gap: 18px; margin-bottom: 44px; flex-shrink: 0; }
  .entete img { width: 56px; height: 56px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.14); }
  .entete .nom { font-size: 25px; font-weight: 700; letter-spacing: -0.2px; }
  .entete .role { font-size: 18px; color: ${C.grisSombre}; margin-top: 2px; }

  /* La signature discrète : sur les gabarits où l'image doit respirer
     (citation, chiffre, écran). Une ligne, en bas, sans photo. */
  .signature {
    margin-top: auto; display: flex; align-items: center; justify-content: space-between;
    font-size: 21px; color: ${C.grisSombre}; flex-shrink: 0;
  }
  .signature b { color: ${C.blanc}; font-weight: 600; }

  .pied { margin-top: auto; display: flex; align-items: flex-end; justify-content: space-between; flex-shrink: 0; }
  .pied .site { font-size: 21px; color: ${C.grisSombre}; }

  .corpsCentral { flex: 1; display: flex; flex-direction: column; justify-content: center; min-height: 0; }

  .surtitre {
    display: inline-block; align-self: flex-start;
    font-size: 20px; font-weight: 700; letter-spacing: 1.6px; text-transform: uppercase;
    color: ${C.blanc}; background: rgba(249,168,37,0.15);
    border: 1px solid ${C.bordure}; border-radius: 999px; padding: 11px 24px; margin-bottom: 34px;
    flex-shrink: 0;
  }
  .or { color: ${C.or}; }
  .fort { color: ${C.blanc}; font-weight: 600; }

  /* ── citation ──────────────────────────────────────────────────────────── */
  .citation .guillemet {
    font-size: 200px; line-height: 0.6; color: ${C.or}; opacity: 0.35;
    font-family: Georgia, 'Times New Roman', serif; margin-bottom: 18px;
  }
  .citation .phrase { font-size: 76px; line-height: 1.12; font-weight: 800; letter-spacing: -2.2px; }
  .citation .phrase.long { font-size: 60px; letter-spacing: -1.5px; }
  .citation .apres { font-size: 30px; line-height: 1.45; color: ${C.gris}; margin-top: 40px; }

  /* ── chiffre ───────────────────────────────────────────────────────────── */
  .chiffre .nombre {
    font-size: 300px; line-height: 0.88; font-weight: 800; color: ${C.or};
    letter-spacing: -12px; font-variant-numeric: tabular-nums;
  }
  .chiffre .nombre.long { font-size: 210px; letter-spacing: -8px; }
  .chiffre .unite { font-size: 46px; font-weight: 700; color: ${C.blanc}; margin-top: 26px; letter-spacing: -1px; }
  .chiffre .contexte { font-size: 31px; line-height: 1.45; color: ${C.gris}; margin-top: 30px; max-width: 840px; }

  /* ── avantApres ────────────────────────────────────────────────────────── */
  .panneaux { display: flex; flex-direction: column; gap: 26px; flex: 1; justify-content: center; min-height: 0; }
  .panneau { border: 1px solid ${C.bordure}; border-radius: 26px; padding: 34px 38px; background: rgba(255,255,255,0.03); }
  .panneau .etiquette {
    font-size: 19px; letter-spacing: 1.6px; text-transform: uppercase; font-weight: 700;
    display: inline-block; padding: 8px 18px; border-radius: 999px; margin-bottom: 20px;
  }
  .panneau.avant { border-left: 5px solid ${C.avant}; }
  .panneau.avant .etiquette { color: ${C.avant}; background: rgba(140,74,74,0.16); }
  .panneau.apres { border-left: 5px solid ${C.bleu}; }
  .panneau.apres .etiquette { color: ${C.bleu}; background: rgba(7,129,254,0.16); }
  .panneau h2 { font-size: 40px; line-height: 1.15; font-weight: 800; letter-spacing: -1.2px; }
  .panneau ul { list-style: none; margin-top: 22px; }
  /* 38px et non 28 : à 28 le tiret touchait la première lettre, alors que la
     coche, plus étroite, laissait de l'air. Les deux listes doivent s'aligner. */
  .panneau li { font-size: 27px; line-height: 1.42; color: ${C.gris}; padding-left: 38px; position: relative; margin-top: 12px; }
  .panneau li::before { content: '—'; position: absolute; left: 0; color: ${C.grisSombre}; }
  .panneau.apres li::before { content: '✓'; color: ${C.bleu}; font-weight: 700; }
  .fleche { text-align: center; font-size: 34px; color: ${C.grisSombre}; }

  /* ── etapes ────────────────────────────────────────────────────────────── */
  .etapes { display: flex; flex-direction: column; gap: 0; flex: 1; justify-content: center; min-height: 0; }
  /* L'espace entre deux étapes appartient au TEXTE, pas à l'étape : sinon le
     rail s'arrête au bas du texte et un trou apparaît avant la pastille
     suivante. En le mettant dans .texte, la hauteur de l'étape inclut l'espace
     et le trait, en flex:1, le parcourt entièrement. */
  .etape { display: flex; gap: 26px; position: relative; }
  .etape .rail { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
  .etape .point {
    width: 54px; height: 54px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; font-weight: 800; color: ${C.fond}; background: ${C.or};
  }
  .etape .trait { width: 2px; flex: 1; background: ${C.bordure}; margin-top: 8px; }
  .etape:last-child .trait { display: none; }
  .etape .texte { padding-top: 6px; padding-bottom: 36px; }
  .etape:last-child .texte { padding-bottom: 0; }
  .etape h3 { font-size: 36px; line-height: 1.2; font-weight: 700; letter-spacing: -0.9px; }
  .etape p { font-size: 26px; line-height: 1.45; color: ${C.gris}; margin-top: 10px; }

  /* ── liste ─────────────────────────────────────────────────────────────── */
  .liste { display: flex; flex-direction: column; gap: 24px; flex: 1; justify-content: center; min-height: 0; }
  .item { display: flex; gap: 24px; align-items: flex-start; }
  .item .num {
    font-size: 54px; font-weight: 800; color: ${C.or}; line-height: 1;
    min-width: 76px; font-variant-numeric: tabular-nums; letter-spacing: -2px;
  }
  .item .contenu h3 { font-size: 33px; line-height: 1.22; font-weight: 700; letter-spacing: -0.8px; }
  .item .contenu p { font-size: 25px; line-height: 1.42; color: ${C.gris}; margin-top: 8px; }

  /* ── comparatif ────────────────────────────────────────────────────────── */
  .tableau { border: 1px solid ${C.bordure}; border-radius: 24px; overflow: hidden; }
  .ligne { display: grid; grid-template-columns: 1fr 1fr; }
  .ligne + .ligne { border-top: 1px solid ${C.bordure}; }
  .cellule { padding: 26px 28px; font-size: 26px; line-height: 1.4; color: ${C.gris}; }
  .cellule + .cellule { border-left: 1px solid ${C.bordure}; }
  .ligne.tete .cellule {
    font-size: 24px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase;
    color: ${C.blanc}; background: rgba(255,255,255,0.05);
  }
  .ligne.tete .cellule.droite { color: ${C.or}; }
  .cellule.droite { color: ${C.blanc}; background: rgba(7,129,254,0.06); }

  /* ── ecran — une interface INVENTÉE, jamais une capture ────────────────── */
  .cadre {
    border: 1px solid ${C.bordure}; border-radius: 22px; overflow: hidden;
    background: ${C.fondProfond}; box-shadow: 0 30px 80px rgba(0,0,0,0.5);
  }
  .barre { display: flex; align-items: center; gap: 9px; padding: 18px 22px; background: rgba(255,255,255,0.045); }
  .pastille { width: 13px; height: 13px; border-radius: 50%; background: ${C.grisSombre}; opacity: 0.55; }
  .barre .url {
    margin-left: 16px; font-size: 18px; color: ${C.grisSombre};
    background: rgba(0,0,0,0.35); border-radius: 8px; padding: 7px 16px;
  }
  .ecranCorps { padding: 30px; display: flex; gap: 22px; }
  .colonneNav { width: 190px; flex-shrink: 0; display: flex; flex-direction: column; gap: 13px; }
  .navItem { height: 34px; border-radius: 9px; background: rgba(255,255,255,0.05); }
  .navItem.actif { background: rgba(7,129,254,0.3); }
  .zone { flex: 1; display: flex; flex-direction: column; gap: 18px; }
  .cartes { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .carte { border: 1px solid ${C.bordure}; border-radius: 14px; padding: 18px; background: rgba(255,255,255,0.035); }
  .carte .k { font-size: 16px; color: ${C.grisSombre}; letter-spacing: 0.8px; text-transform: uppercase; }
  .carte .v { font-size: 34px; font-weight: 800; color: ${C.or}; margin-top: 8px; letter-spacing: -1px; }
  .rangs { display: flex; flex-direction: column; gap: 11px; }
  .rang { display: flex; align-items: center; gap: 14px; }
  .rang .barreFine { height: 13px; border-radius: 7px; background: rgba(255,255,255,0.09); flex: 1; }
  .rang .barreFine i { display: block; height: 100%; border-radius: 7px; background: ${C.bleu}; }
  .rang .etat {
    font-size: 15px; padding: 5px 13px; border-radius: 999px; flex-shrink: 0;
    border: 1px solid ${C.bordure}; color: ${C.grisSombre};
  }

  /* Titres communs aux gabarits structurés. */
  .titreBloc { font-size: 58px; line-height: 1.1; font-weight: 800; letter-spacing: -1.8px; margin-bottom: 14px; flex-shrink: 0; }
  .titreBloc.petit { font-size: 47px; letter-spacing: -1.3px; }
  .sousBloc { font-size: 28px; line-height: 1.42; color: ${C.gris}; margin-bottom: 36px; flex-shrink: 0; }
`;

/* ────────────────────────────────────────────────────────────────────────────
 * NORMALISATION — deux écritures pour le même visuel, et un piège.
 *
 * Les contenus arrivent de deux sources : écrits à la main, ils adoptent la
 * forme imbriquée ({ avant: { titre, points } }) ; produits par un agent, ils
 * arrivent à plat ({ avant_titre, avant_points }), parce qu'un schéma JSON se
 * décrit mal en profondeur. Plutôt que d'imposer une forme et de retraduire à
 * chaque fois, le générateur accepte les deux.
 *
 * Le piège : un agent qui sérialise du JSON échappe volontiers les balises, et
 * « &lt;span class="or"&gt; » s'affiche alors en clair sur l'image. On rétablit
 * les trois seules balises autorisées, et RIEN d'autre : si un texte contient
 * une esperluette, elle doit rester telle quelle.
 * ──────────────────────────────────────────────────────────────────────────── */
function desechappe(s) {
  if (typeof s !== 'string') return s;
  return s
    .replace(/&lt;(\/?)(br|span)\b/gi, '<$1$2')
    .replace(/&lt;br\s*\/?&gt;/gi, '<br>')
    .replace(/class=&quot;(or|fort)&quot;/gi, 'class="$1"')
    .replace(/(<(?:br|\/?span)[^>]*)&gt;/gi, '$1>');
}

function nettoie(x) {
  if (typeof x === 'string') return desechappe(x);
  if (Array.isArray(x)) return x.map(nettoie);
  if (x && typeof x === 'object') {
    const o = {};
    for (const [k, v] of Object.entries(x)) o[k] = nettoie(v);
    return o;
  }
  return x;
}

function normalise(v) {
  const n = nettoie({ ...v });
  // avantApres : champs à plat -> objets imbriqués.
  if (n.gabarit === 'avantApres') {
    n.avant = n.avant || { titre: n.avant_titre, points: n.avant_points || [], etiquette: n.avant_etiquette };
    n.apres = n.apres || { titre: n.apres_titre, points: n.apres_points || [], etiquette: n.apres_etiquette };
  }
  // citation : « apres » et « apres_phrase » désignent la même chose.
  if (n.gabarit === 'citation' && !n.apres && n.apres_phrase) n.apres = n.apres_phrase;
  // ecran : la colonne de navigation et la barre d'adresse sont purement
  // décoratives. Les exiger obligerait chaque contenu à décrire des pastilles
  // grises qui ne veulent rien dire — on leur donne donc un défaut.
  if (n.gabarit === 'ecran') {
    n.nav = n.nav || [1, 2, 3, 4, 5, 6];
    n.navActif = n.navActif ?? 1;
    n.url = n.url || 'votre outil · tableau de bord';
    n.cartes = n.cartes || [];
    n.rangs = n.rangs || [];
  }
  return n;
}

/* ────────────────────────────────────────────────────────────────────────── */
const ent = (avatar) =>
  '<div class="entete"><img src="' + avatar + '" alt="" /><div>' +
  '<div class="nom">' + IDENTITE.nom + '</div>' +
  '<div class="role">' + IDENTITE.role + '</div></div></div>';

const sign = () =>
  '<div class="signature"><div><b>' + IDENTITE.nom + '</b> · Développeur Full Stack</div>' +
  '<div>' + IDENTITE.site + '</div></div>';

const piedSite = () => '<div class="pied"><div class="site">' + IDENTITE.site + '</div><div></div></div>';

const titre = (v) =>
  (v.surtitre ? '<div class="surtitre">' + v.surtitre + '</div>' : '') +
  (v.titre ? '<div class="titreBloc' + (v.titre.length > 42 ? ' petit' : '') + '">' + v.titre + '</div>' : '') +
  (v.sous ? '<div class="sousBloc">' + v.sous + '</div>' : '');

const GABARITS = {
  citation: (v, a) =>
    '<div class="corpsCentral citation">' +
    '<div class="guillemet">&ldquo;</div>' +
    '<div class="phrase' + (v.phrase.replace(/<[^>]+>/g, '').length > 78 ? ' long' : '') + '">' + v.phrase + '</div>' +
    (v.apres ? '<div class="apres">' + v.apres + '</div>' : '') +
    '</div>' + sign(),

  chiffre: (v, a) =>
    ent(a) +
    '<div class="corpsCentral chiffre">' +
    '<div class="nombre' + (String(v.nombre).length > 3 ? ' long' : '') + '">' + v.nombre + '</div>' +
    '<div class="unite">' + v.unite + '</div>' +
    '<div class="contexte">' + v.contexte + '</div>' +
    '</div>' + piedSite(),

  avantApres: (v, a) =>
    ent(a) + titre(v) +
    '<div class="panneaux">' +
    '<div class="panneau avant"><span class="etiquette">' + (v.avant.etiquette || 'Avant') + '</span>' +
    '<h2>' + v.avant.titre + '</h2><ul>' + v.avant.points.map((p) => '<li>' + p + '</li>').join('') + '</ul></div>' +
    '<div class="fleche">↓</div>' +
    '<div class="panneau apres"><span class="etiquette">' + (v.apres.etiquette || 'Après') + '</span>' +
    '<h2>' + v.apres.titre + '</h2><ul>' + v.apres.points.map((p) => '<li>' + p + '</li>').join('') + '</ul></div>' +
    '</div>' + piedSite(),

  etapes: (v, a) =>
    ent(a) + titre(v) +
    '<div class="etapes">' +
    v.etapes.map((e, i) =>
      '<div class="etape"><div class="rail"><div class="point">' + (i + 1) + '</div><div class="trait"></div></div>' +
      '<div class="texte"><h3>' + e.titre + '</h3><p>' + e.texte + '</p></div></div>',
    ).join('') +
    '</div>' + piedSite(),

  liste: (v, a) =>
    ent(a) + titre(v) +
    '<div class="liste">' +
    v.points.map((p, i) =>
      '<div class="item"><div class="num">' + String(i + 1).padStart(2, '0') + '</div>' +
      '<div class="contenu"><h3>' + p.titre + '</h3>' + (p.texte ? '<p>' + p.texte + '</p>' : '') + '</div></div>',
    ).join('') +
    '</div>' + piedSite(),

  comparatif: (v, a) =>
    ent(a) + titre(v) +
    '<div class="corpsCentral"><div class="tableau">' +
    '<div class="ligne tete"><div class="cellule">' + v.colonnes[0] + '</div>' +
    '<div class="cellule droite">' + v.colonnes[1] + '</div></div>' +
    v.lignes.map((l) =>
      '<div class="ligne"><div class="cellule">' + l[0] + '</div>' +
      '<div class="cellule droite">' + l[1] + '</div></div>',
    ).join('') +
    '</div></div>' + piedSite(),

  // Le titre vit DANS le bloc centré : posé en haut, il laissait un vide de
  // plus de trois cents pixels entre lui et la fenêtre. Ensemble, ils forment
  // un seul objet que la diapo centre d'un bloc.
  ecran: (v, a) =>
    '<div class="corpsCentral">' + titre(v) +
    '<div class="cadre">' +
    '<div class="barre"><span class="pastille"></span><span class="pastille"></span><span class="pastille"></span>' +
    '<span class="url">' + (v.url || 'votre-outil · interne') + '</span></div>' +
    '<div class="ecranCorps">' +
    '<div class="colonneNav">' +
    v.nav.map((n, i) => '<div class="navItem' + (i === (v.navActif ?? 0) ? ' actif' : '') + '"></div>').join('') +
    '</div><div class="zone">' +
    '<div class="cartes">' +
    v.cartes.map((c) => '<div class="carte"><div class="k">' + c.k + '</div><div class="v">' + c.v + '</div></div>').join('') +
    '</div><div class="rangs">' +
    v.rangs.map((r) =>
      '<div class="rang"><div class="barreFine"><i style="width:' + r.pct + '%"></i></div>' +
      '<div class="etat">' + r.etat + '</div></div>',
    ).join('') +
    '</div></div></div></div></div>' + sign(),
};

/* La fenêtre du gabarit « ecran » se ferme dans la chaîne ci-dessus : le bloc
   centré ouvert avant le titre englobe désormais le cadre. */

/* ────────────────────────────────────────────────────────────────────────── */
const nom = process.argv[2];
const DOSSIER = join(ici, 'visuels');
if (!nom) {
  const dispo = existsSync(DOSSIER)
    ? readdirSync(DOSSIER).filter((f) => f.endsWith('.mjs')).map((f) => f.replace(/\.mjs$/, ''))
    : [];
  console.error('Indique le visuel à générer : node scripts/gen-visuel.mjs <nom>');
  console.error('Disponibles : ' + (dispo.join(', ') || '(aucun)'));
  console.error('Gabarits    : ' + Object.keys(GABARITS).join(', '));
  process.exit(1);
}
const source = join(DOSSIER, nom + '.mjs');
if (!existsSync(source)) throw new Error('Visuel introuvable : ' + source);
const { default: JEU } = await import(pathToFileURL(source).href);

const inconnus = JEU.visuels.filter((v) => !GABARITS[v.gabarit]);
if (inconnus.length) {
  throw new Error('Gabarit inconnu : ' + inconnus.map((v) => v.gabarit).join(', ') +
    ' — disponibles : ' + Object.keys(GABARITS).join(', '));
}

const CHROMES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  (process.env.LOCALAPPDATA || '') + '/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
];
const chrome = CHROMES.find((p) => p && existsSync(p));
if (!chrome) throw new Error('Chrome introuvable — installez-le ou complétez CHROMES.');

const avatar = await photoRonde(140);
const html =
  '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8" /><style>' + style + '</style></head><body>' +
  JEU.visuels.map((v) => '<section class="visuel">' + GABARITS[v.gabarit](normalise(v), avatar) + '</section>').join('\n') +
  '</body></html>';

const tmp = join(tmpdir(), 'visuel-' + JEU.fichier);
mkdirSync(tmp, { recursive: true });
const pageHtml = join(tmp, 'index.html');
writeFileSync(pageHtml, html, 'utf8');
mkdirSync(SORTIE, { recursive: true });

const navigateur = await puppeteer.launch({
  executablePath: chrome,
  headless: 'new',
  args: ['--no-sandbox', '--font-render-hinting=none'],
});
try {
  const page = await navigateur.newPage();
  await page.setViewport({ width: L, height: H, deviceScaleFactor: 2 });
  await page.goto('file:///' + pageHtml.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });

  const cadres = await page.$$('.visuel');
  for (let i = 0; i < cadres.length; i++) {
    await cadres[i].screenshot({
      path: join(SORTIE, JEU.fichier + '-' + String(i + 1).padStart(2, '0') + '.png'),
    });
  }
  console.log('  PNG : ' + cadres.length + ' visuels dans ' + SORTIE);
  JEU.visuels.forEach((v, i) =>
    console.log('    ' + String(i + 1).padStart(2, '0') + ' · ' + v.gabarit));

  // Garde-fou : un texte qui déborde passerait inaperçu sur un aperçu réduit.
  const debords = await page.$$eval('.visuel', (ds) =>
    ds.map((d, i) => ({ i: i + 1, trop: d.scrollHeight - d.clientHeight })).filter((x) => x.trop > 2),
  );
  if (debords.length) {
    console.log('  ATTENTION — débordement sur : ' +
      debords.map((d) => 'visuel ' + d.i + ' (+' + d.trop + 'px)').join(', '));
  } else {
    console.log('  débord : aucun');
  }
} finally {
  await navigateur.close();
  rmSync(tmp, { recursive: true, force: true });
}
