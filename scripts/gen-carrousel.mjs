/**
 * Générateur de carrousels LinkedIn — charte Hope Traders appliquée au profil
 * personnel de Nathan.
 *
 * ── Pourquoi ce format ──────────────────────────────────────────────────────
 * Le post « document » (un PDF que le lecteur fait défiler) est le format le
 * plus performant sur LinkedIn : 6,6 à 7 % d'engagement contre 2 à 4,5 % pour
 * le texte seul, et il progresse quand la vidéo recule. Deux raisons : le temps
 * passé — vingt secondes de défilement pèsent bien plus que trois secondes de
 * lecture — et l'enregistrement, qui vaut environ cinq fois un « j'aime » dans
 * la portée. On enregistre un document parce qu'on compte y revenir.
 *
 * ── Pourquoi Chrome et pas du SVG à la main ─────────────────────────────────
 * Le SVG n'a pas de retour à la ligne automatique : il faudrait mesurer chaque
 * chaîne et couper soi-même, ce qui casse au premier texte modifié. Chrome
 * apporte le vrai rendu typographique, et surtout printToPDF produit
 * directement le PDF multi-pages que LinkedIn attend — une page par
 * diapositive, sans assemblage.
 *
 * ── La structure APASA ──────────────────────────────────────────────────────
 * Accroche · Problème · Agitation · Solution · Action. Tout est centré sur le
 * ressenti du lecteur : il doit se reconnaître dans le problème avant qu'on lui
 * parle de nous. L'agitation NOMME les conséquences réelles, elle ne les
 * dramatise pas — c'est ce qui la garde honnête, et dans la voix de Nathan.
 *
 * Usage  : node scripts/gen-carrousel.mjs
 * Sortie : brand/carrousel/<nom>.pdf (à publier) + <nom>-NN.png (aperçus)
 */
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const ici = dirname(fileURLToPath(import.meta.url));
const RACINE = join(ici, '..');
const SORTIE = join(RACINE, 'brand', 'carrousel');

/** Charte Hope Traders — mêmes valeurs que hopetraders-site/scripts/charte.mjs. */
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
};

/** 1080 x 1350 : portrait 4:5, le format le plus haut accepté par LinkedIn. */
const L = 1080;
const H = 1350;

const IDENTITE = {
  nom: 'Nathan Diffo',
  role: 'Développeur Full Stack · Digitalisation de processus',
  site: 'diffonathan.github.io',
  mail: 'diffoprincer@gmail.com',
  preuve: '8 outils en ligne',
};

/* ────────────────────────────────────────────────────────────────────────────
 * LE CONTENU — seule partie à changer d'une publication à l'autre.
 * ──────────────────────────────────────────────────────────────────────────── */
/*
 * ── Règle de confidentialité, à respecter à chaque publication ──────────────
 * Nathan construit ces outils pour un employeur, sur des dossiers de CLIENTS
 * de cet employeur, qui ne souhaite pas qu'on en parle. Cela ne l'empêche pas
 * de parler de son métier — mais la voix change, et c'est la voix qui protège.
 *
 * CE QUI LUI APPARTIENT et peut être publié :
 *   - la nature du problème (répondre à un appel d'offres suppose de lire des
 *     centaines de pages : c'est une évidence du secteur, pas un secret) ;
 *   - ses décisions de conception et leur raison — son apport intellectuel ;
 *   - sa compétence, énoncée au présent du métier.
 *
 * CE QUI NE LUI APPARTIENT PAS et ne doit JAMAIS figurer :
 *   - une référence de dossier, une date de remise réelle, des volumes tirés
 *     d'un projet précis, un nom de client ou de projet ;
 *   - l'URL d'un outil interne, une capture de données réelles.
 *
 * La règle en une phrase : ÉNONCER UN MÉTIER, NE PAS RACONTER UN DOSSIER.
 * « Un dossier reçu la semaine dernière » désigne un fait chez un client.
 * « Répondre à un appel d'offres, c'est lire des centaines de pages » énonce
 * une vérité du secteur — et démontre exactement la même compétence.
 */
const CARROUSEL = {
  fichier: 'extraction-verifiable',
  diapos: [
    {
      // Pas de sur-titre : la première diapo doit happer, pas s'annoncer.
      titre: 'Une IA vous annonce :<br>« date limite :<br><span class="or">28 septembre</span> ».<br>Vous la croyez ?',
      sous: 'La question qui décide si un outil d’extraction sert vraiment à quelque chose.',
    },
    {
      surtitre: 'Le problème',
      titre: 'Répondre à un appel d’offres,<br>c’est lire des centaines<br>de pages.',
      corps:
        'Pour en tirer trois informations : la date limite, le périmètre, les pièces à fournir. ' +
        'Dans la plupart des équipes, quelqu’un le fait encore à la main.',
    },
    {
      surtitre: 'Ce que ça coûte vraiment',
      titre: 'Ce n’est pas<br>le temps perdu.',
      corps:
        'C’est le jour où l’information est ratée. L’offre part sans une pièce obligatoire, ou arrive après l’heure. ' +
        '<span class="fort">Des semaines de travail ne comptent plus.</span><br><br>' +
        'Personne n’a mal fait son travail. Le dossier était simplement trop gros pour un œil humain un vendredi soir.',
    },
    {
      surtitre: 'Ce que je construis',
      titre: 'Automatiser cette lecture<br>est la partie facile.',
      corps:
        'Lire des PDF, même scannés, et en sortir une date : la technique existe et fonctionne. ' +
        '<span class="fort">La difficulté n’est pas là.</span><br><br>' +
        'Elle est dans ce qu’on fait de la réponse. Une machine qui affirme sans montrer déplace le risque au lieu de l’enlever.',
    },
    {
      surtitre: 'Le point qui change tout',
      titre: 'Montrer<br>le passage source.',
      corps: 'À côté de chaque information extraite, la phrase exacte d’où elle vient.',
      encart: {
        titre: 'Exemple — ce que voit l’opérateur',
        valeur: '28 septembre 2025 — 12 h 00',
        source: '« Les offres devront parvenir au plus tard le 28/09/2025 à 12 h 00, cachet faisant foi. »',
        page: 'Exemple d’illustration · page 14',
      },
    },
    {
      offre: true,
      titre: 'Un processus qui<br>ressemble au vôtre ?',
      corps: 'Beaucoup de documents, beaucoup de vérifications à la main, et une erreur qui coûte cher.',
      metier:
        'Je prends un processus qui vit dans des fichiers Excel et des modèles Word, et j’en fais une application que l’équipe utilise tous les jours. Seul, de bout en bout.',
      appel: 'Écrivez-moi. Je vous dirai honnêtement si c’est automatisable — ou si ça n’en vaut pas la peine.',
    },
  ],
};

/* ────────────────────────────────────────────────────────────────────────────
 * La photo, découpée en rond et intégrée en base64 : le HTML rendu par Chrome
 * vit dans un dossier temporaire, un chemin relatif y serait cassé.
 * ──────────────────────────────────────────────────────────────────────────── */
/**
 * Le cadrage du portrait, sur une source de 800 x 800.
 *
 * Deux cadrages ont été essayés et écartés, la comparaison ayant été faite aux
 * tailles RÉELLES d'affichage — un portrait ne se juge pas agrandi :
 *
 * - celui de gen-favicons.mjs (246, 78, 336 x 336) s'arrête à y = 414, alors
 *   que la barbe descend jusqu'à y ≈ 520 : il coupe le menton. Il convient à
 *   une icône de 16 px où le visage n'est qu'une tache, pas à un portrait.
 * - un cadrage serré sur la tête (170, 60, 460 x 460) coupe le haut du crâne
 *   une fois le masque circulaire appliqué, et colle le menton au bord.
 *
 * Celui-ci laisse de l'air au-dessus de la tête et descend jusqu'aux épaules.
 * Il reste lisible à 56 px comme à 190 px : un seul cadrage suffit donc pour
 * les deux usages.
 */
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

/* ──────────────────────────────────────────────────────────────────────────── */
const style = `
  @page { size: ${L}px ${H}px; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', 'DM Sans', Arial, Helvetica, sans-serif; -webkit-font-smoothing: antialiased; }

  .diapo {
    position: relative; width: ${L}px; height: ${H}px; overflow: hidden;
    color: ${C.blanc}; page-break-after: always; break-after: page;
    background:
      radial-gradient(90% 90% at 12% 0%, rgba(7,129,254,0.14) 0%, rgba(7,129,254,0) 62%),
      radial-gradient(80% 80% at 88% 100%, rgba(249,168,37,0.11) 0%, rgba(249,168,37,0) 62%),
      linear-gradient(160deg, ${C.fondClair} 0%, ${C.fond} 60%, ${C.fondProfond} 100%);
    padding: 84px 84px 76px;
    display: flex; flex-direction: column;
  }
  .diapo:last-child { page-break-after: auto; break-after: auto; }

  .entete { display: flex; align-items: center; gap: 18px; margin-bottom: 54px; }
  .entete img { width: 56px; height: 56px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.14); }
  .entete .nom { font-size: 25px; font-weight: 700; letter-spacing: -0.2px; }
  .entete .role { font-size: 18px; color: ${C.grisSombre}; margin-top: 2px; }

  /* Le bloc central est centré verticalement : sans cela le texte se colle en
     haut et le tiers inférieur reste vide, ce qui donne une diapo bancale sur
     les titres courts. L'en-tête reste en haut, le pied en bas. */
  .contenu { flex: 1; display: flex; flex-direction: column; justify-content: center; min-height: 0; }

  .surtitre {
    display: inline-block; align-self: flex-start;
    font-size: 20px; font-weight: 700; letter-spacing: 1.6px; text-transform: uppercase;
    color: ${C.blanc}; background: rgba(249,168,37,0.15);
    border: 1px solid ${C.bordure}; border-radius: 999px; padding: 11px 24px; margin-bottom: 40px;
  }

  h1 { font-size: 86px; line-height: 1.05; font-weight: 800; letter-spacing: -2.6px; }
  h1.petit { font-size: 70px; letter-spacing: -1.9px; }
  .sous { font-size: 31px; color: ${C.gris}; margin-top: 36px; line-height: 1.42; }
  .corps { font-size: 33px; line-height: 1.5; color: ${C.gris}; margin-top: 38px; }
  .or { color: ${C.or}; }
  .fort { color: ${C.blanc}; font-weight: 600; }

  /* Encart « extraction vérifiable » : la démonstration visuelle du propos. */
  .encart {
    margin-top: 48px; border: 1px solid ${C.bordure}; border-radius: 22px;
    background: rgba(255,255,255,0.035); padding: 34px 36px;
  }
  .encart .etiquette { font-size: 19px; letter-spacing: 1.2px; text-transform: uppercase; color: ${C.grisSombre}; }
  .encart .valeur { font-size: 38px; font-weight: 700; color: ${C.or}; margin-top: 12px; letter-spacing: -0.8px; }
  .encart .source {
    margin-top: 24px; padding-left: 22px; border-left: 4px solid ${C.or};
    font-size: 24px; line-height: 1.45; color: ${C.gris}; font-style: italic;
  }
  .encart .page { margin-top: 16px; font-size: 20px; color: ${C.grisSombre}; }

  .pied { margin-top: auto; display: flex; align-items: flex-end; justify-content: space-between; }
  .pied .site { font-size: 22px; color: ${C.grisSombre}; }
  .num { font-size: 22px; color: ${C.grisSombre}; font-variant-numeric: tabular-nums; }
  .num b { color: ${C.blanc}; }
  .defiler { display: flex; align-items: center; gap: 10px; font-size: 22px; color: ${C.or}; font-weight: 600; }

  /* Dernière diapo : l'offre. */
  .offre { display: flex; flex-direction: column; align-items: center; text-align: center; justify-content: center; flex: 1; }
  .offre img.portrait {
    width: 186px; height: 186px; border-radius: 50%;
    border: 3px solid rgba(249,168,37,0.55); margin-bottom: 32px;
  }
  .offre h1 { font-size: 60px; letter-spacing: -1.6px; }
  .offre .metier { font-size: 28px; line-height: 1.5; color: ${C.gris}; margin-top: 26px; max-width: 800px; }
  .offre .appel {
    margin-top: 34px; font-size: 29px; line-height: 1.45; color: ${C.blanc}; font-weight: 600;
    max-width: 820px; border-top: 1px solid ${C.bordure}; padding-top: 30px;
  }
  .contact { margin-top: 34px; display: flex; gap: 14px; align-items: center; flex-wrap: wrap; justify-content: center; }
  .puce {
    font-size: 24px; padding: 14px 28px; border-radius: 999px;
    border: 1px solid ${C.bordure}; background: rgba(255,255,255,0.04); color: ${C.blanc};
  }
  .puce.pleine { background: ${C.bleu}; border-color: ${C.bleu}; font-weight: 700; }
`;

/**
 * `gauche` vaut 'defiler' sur la première diapo, 'site' au milieu, et 'rien'
 * sur celle de l'offre — où l'adresse figure déjà dans la puce bleue, et où la
 * répéter en bas ferait doublon à trois centimètres d'écart.
 */
const pied = (i, total, gauche) =>
  '<div class="pied">' +
  (gauche === 'defiler'
    ? '<div class="defiler">Faites défiler &nbsp;›&nbsp;›</div>'
    : gauche === 'site'
      ? '<div class="site">' + IDENTITE.site + '</div>'
      : '<div></div>') +
  '<div class="num"><b>' + (i + 1) + '</b> / ' + total + '</div>' +
  '</div>';

function diapoHTML(d, i, total, avatar, portrait) {
  if (d.offre) {
    return (
      '<section class="diapo"><div class="offre">' +
      '<img class="portrait" src="' + portrait + '" alt="" />' +
      '<h1>' + d.titre + '</h1>' +
      '<div class="metier">' + d.corps + '</div>' +
      '<div class="metier">' + d.metier + '</div>' +
      '<div class="appel">' + d.appel + '</div>' +
      '<div class="contact">' +
      '<span class="puce pleine">' + IDENTITE.site + '</span>' +
      '<span class="puce">' + IDENTITE.mail + '</span>' +
      '<span class="puce">' + IDENTITE.preuve + '</span>' +
      '</div></div>' + pied(i, total, 'rien') + '</section>'
    );
  }
  // Un titre de trois lignes ou un encart : on descend d'un cran en taille pour
  // que la diapo respire au lieu de toucher les bords.
  const dense = (d.titre.match(/<br>/g) || []).length >= 2 || Boolean(d.encart);
  return (
    '<section class="diapo">' +
    (i === 0
      ? '<div class="entete"><img src="' + avatar + '" alt="" /><div>' +
        '<div class="nom">' + IDENTITE.nom + '</div>' +
        '<div class="role">' + IDENTITE.role + '</div></div></div>'
      : '') +
    '<div class="contenu">' +
    (d.surtitre ? '<div class="surtitre">' + d.surtitre + '</div>' : '') +
    '<h1 class="' + (dense ? 'petit' : '') + '">' + d.titre + '</h1>' +
    (d.sous ? '<div class="sous">' + d.sous + '</div>' : '') +
    (d.corps ? '<div class="corps">' + d.corps + '</div>' : '') +
    (d.encart
      ? '<div class="encart">' +
        '<div class="etiquette">' + d.encart.titre + '</div>' +
        '<div class="valeur">' + d.encart.valeur + '</div>' +
        '<div class="source">' + d.encart.source + '</div>' +
        '<div class="page">' + d.encart.page + '</div>' +
        '</div>'
      : '') +
    '</div>' +
    pied(i, total, i === 0 ? 'defiler' : 'site') +
    '</section>'
  );
}

/* ──────────────────────────────────────────────────────────────────────────── */
const CHROMES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  (process.env.LOCALAPPDATA || '') + '/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
];
const chrome = CHROMES.find((p) => p && existsSync(p));
if (!chrome) throw new Error('Chrome introuvable — installez-le ou complétez CHROMES.');

const avatar = await photoRonde(140);
const portrait = await photoRonde(420);
const total = CARROUSEL.diapos.length;
const html =
  '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8" /><style>' + style + '</style></head><body>' +
  CARROUSEL.diapos.map((d, i) => diapoHTML(d, i, total, avatar, portrait)).join('\n') +
  '</body></html>';

// Le HTML vit dans un dossier temporaire : il n'a rien à faire dans public/,
// où il partirait avec le site au prochain déploiement.
const tmp = join(tmpdir(), 'carrousel-' + CARROUSEL.fichier);
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

  // Le PDF : c'est le fichier à publier sur LinkedIn.
  const pdf = join(SORTIE, CARROUSEL.fichier + '.pdf');
  await page.pdf({
    path: pdf,
    width: L + 'px',
    height: H + 'px',
    printBackground: true,
    pageRanges: '1-' + total,
  });

  // Les PNG : pour relire chaque diapo avant de publier.
  const cadres = await page.$$('.diapo');
  for (let i = 0; i < cadres.length; i++) {
    await cadres[i].screenshot({
      path: join(SORTIE, CARROUSEL.fichier + '-' + String(i + 1).padStart(2, '0') + '.png'),
    });
  }

  // Contrôle : une page par diapositive ? On compte dans les octets produits
  // plutôt que de faire confiance à printToPDF.
  const pages = (readFileSync(pdf).toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  console.log('  PDF   : ' + pdf);
  console.log('  pages : ' + pages + ' (attendu ' + total + ')' + (pages === total ? '' : '  <-- ANOMALIE'));
  console.log('  PNG   : ' + cadres.length + ' aperçus dans ' + SORTIE);

  // Garde-fou : un texte qui déborde de sa diapo passerait inaperçu sur les
  // aperçus réduits, mais serait coupé à la publication.
  const debords = await page.$$eval('.diapo', (ds) =>
    ds.map((d, i) => ({ i: i + 1, trop: d.scrollHeight - d.clientHeight })).filter((x) => x.trop > 2),
  );
  if (debords.length) {
    console.log('  ATTENTION — texte trop long sur : ' +
      debords.map((d) => 'diapo ' + d.i + ' (+' + d.trop + 'px)').join(', '));
  } else {
    console.log('  débord : aucun');
  }
} finally {
  await navigateur.close();
  rmSync(tmp, { recursive: true, force: true });
}
