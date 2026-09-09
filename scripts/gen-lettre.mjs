/**
 * Lettre de motivation en PDF — même charte que le CV, rendue par Chrome.
 *
 * Réutilisable : le contenu vit dans un JSON, un fichier par candidature. La
 * lettre et le CV partagent l'en-tête et les couleurs, pour que le dossier se
 * lise comme un ensemble et non comme deux pièces rapportées.
 *
 * Le texte reste sélectionnable et les liens cliquables, pour la même raison
 * que sur le CV : une candidature se lit à l'écran, et une adresse qu'il faut
 * recopier à la main n'est jamais ouverte.
 *
 * Une garde particulière : `motObligatoire`. Certaines annonces exigent un mot
 * précis dans la candidature pour prouver qu'elle a été lue en entier — sans
 * lui, le dossier est écarté sans être ouvert. Le script REFUSE de produire le
 * PDF si le mot est absent du texte.
 *
 * Usage : node scripts/gen-lettre.mjs --source=CHEMIN.json [--sortie=CHEMIN.pdf]
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync, rmSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import puppeteer from 'puppeteer-core';

const ici = dirname(fileURLToPath(import.meta.url));
const racine = join(ici, '..');

const opt = {};
for (const a of process.argv.slice(2)) {
  const [c, v] = a.replace(/^--/, '').split('=');
  opt[c] = v === undefined ? true : v;
}
if (!opt.source) throw new Error('--source=CHEMIN.json est obligatoire.');
const SOURCE = resolve(opt.source);
const SORTIE = resolve(
  opt.sortie || join(racine, 'public', basename(SOURCE).replace(/\.json$/i, '.pdf')),
);

const CHROMES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  `${process.env.LOCALAPPDATA || ''}/Google/Chrome/Application/chrome.exe`,
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];
const chrome = CHROMES.find((p) => p && existsSync(p));
if (!chrome) throw new Error('Chrome introuvable — installez-le ou complétez CHROMES.');

// Mêmes valeurs que le CV et le site.
const BLEU = '#0781FE';
const OR = '#F9A825';
const ENCRE = '#111116';
const TEXTE = '#26262c';
const GRIS = '#5c5c66';
const FILET = '#e2e2e8';

const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Gère **double** AVANT *simple* : sans cela, `**mot**` laissait une paire
// d'astérisques visibles autour du gras, la syntaxe markdown la plus
// spontanée étant justement la double.
const relief = (s) =>
  esc(s)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
const url = (u) => (/^https?:|^mailto:|^tel:/.test(u) ? u : `https://${u}`);

const L = JSON.parse(readFileSync(SOURCE, 'utf8'));

/* ── La garde du mot obligatoire ───────────────────────────────────────────
   Vérifiée AVANT tout rendu : produire un PDF invalide serait pire que ne
   rien produire, parce qu'on l'enverrait sans s'en apercevoir. */
if (L.motObligatoire) {
  const corpus = [L.objet, ...(L.corps || []), L.formule, ...(L.pieces || [])].join(' ');
  const trouve = corpus.toLowerCase().includes(String(L.motObligatoire).toLowerCase());
  if (!trouve) {
    throw new Error(
      `Le mot obligatoire « ${L.motObligatoire} » n'apparaît pas dans la lettre : ` +
        `l'annonce écarte les candidatures qui l'omettent. PDF non produit.`,
    );
  }
  const n = (corpus.toLowerCase().match(new RegExp(String(L.motObligatoire).toLowerCase(), 'g')) || []).length;
  console.log(`· mot obligatoire « ${L.motObligatoire} » : présent ${n} fois`);
}

const expediteur = [
  L.expediteur?.nom,
  L.expediteur?.adresse,
  L.expediteur?.telephone,
  L.expediteur?.email,
].filter(Boolean);

const lien = (u, t) => `<a href="${esc(url(u))}">${esc(t || u)}</a>`;

const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>${esc(L.objet || 'Lettre de motivation')}</title>
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    font-size: 10.1pt; line-height: 1.46; color: ${TEXTE}; background: #fff;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .page { padding: 14mm 17mm 11mm; }

  /* En-tête : même composition que le CV — prénom léger, patronyme gras. */
  .entete { display: flex; justify-content: space-between; align-items: flex-start; gap: 12mm; }
  h1 { margin: 0; font-size: 19pt; font-weight: 300; letter-spacing: -0.4px; color: ${ENCRE}; line-height: 1.05; }
  h1 span { font-weight: 800; display: block; }
  .fonction { margin: 2mm 0 0; font-size: 8.8pt; font-weight: 700; color: ${BLEU};
              text-transform: uppercase; letter-spacing: 0.6px; }
  .coord { text-align: right; font-size: 8.9pt; color: ${GRIS}; line-height: 1.5; white-space: nowrap; }
  .coord a { color: ${GRIS}; text-decoration: none; }
  .regle { height: 2.4px; width: 20mm; background: ${OR}; margin: 3mm 0 0; border-radius: 2px; }

  .destinataire { margin: 7mm 0 0; font-size: 10pt; color: ${ENCRE}; font-weight: 600; line-height: 1.45; }
  .lieudate { margin: 3.5mm 0 0; font-size: 9.4pt; color: ${GRIS}; }

  .objet { margin: 5.5mm 0 4.5mm; font-size: 10.1pt; color: ${ENCRE}; }
  .objet strong { font-weight: 800; }

  p.corps { margin: 0 0 2.8mm; text-align: justify; }
  strong { color: ${ENCRE}; font-weight: 700; }

  /* Les réalisations : l'annonce exige un portfolio, il doit sauter aux yeux. */
  .pieces {
    margin: 4mm 0 4mm; padding: 3.2mm 4.2mm; border-left: 2.4px solid ${BLEU};
    background: #f7f9fc; font-size: 9.4pt; line-height: 1.5;
  }
  .pieces .titre { font-weight: 800; color: ${ENCRE}; margin: 0 0 1.6mm; }
  .pieces ul { margin: 0; padding-left: 4mm; list-style: none; }
  .pieces li { margin: 0 0 1.2mm; position: relative; padding-left: 3mm; }
  .pieces li::before {
    content: ""; position: absolute; left: 0; top: 1.7mm;
    width: 1.3mm; height: 1.3mm; border-radius: 50%; background: ${OR};
  }
  .pieces a { color: ${BLEU}; text-decoration: none; font-weight: 600; }

  .signature { margin: 5mm 0 0; }
  .signature .nom { font-weight: 800; color: ${ENCRE}; font-size: 11pt; }

  .pied {
    margin-top: 6mm; padding-top: 3mm; border-top: 1px solid ${FILET};
    font-size: 8.6pt; color: ${GRIS};
  }
  .pied a { color: ${GRIS}; text-decoration: none; }
  .pied .sep { color: ${FILET}; }
</style></head>
<body><div class="page">

  <header class="entete">
    <div>
      <h1>${esc((L.expediteur?.nom || '').split(' ').slice(0, -1).join(' '))}<span>${esc((L.expediteur?.nom || '').split(' ').slice(-1)[0])}</span></h1>
      ${L.expediteur?.fonction ? `<p class="fonction">${esc(L.expediteur.fonction)}</p>` : ''}
      <div class="regle"></div>
    </div>
    <div class="coord">
      ${expediteur.slice(1).map((c) => `<div>${esc(c)}</div>`).join('')}
    </div>
  </header>

  ${L.destinataire ? `<p class="destinataire">${esc(L.destinataire).replace(/\n/g, '<br/>')}</p>` : ''}
  ${L.lieuDate ? `<p class="lieudate">${esc(L.lieuDate)}</p>` : ''}

  ${L.objet ? `<p class="objet"><strong>Objet :</strong> ${relief(L.objet)}</p>` : ''}

  ${(L.corps || []).map((p) => `<p class="corps">${relief(p)}</p>`).join('')}

  ${
    L.pieces?.length
      ? `<div class="pieces">
          <p class="titre">${esc(L.piecesTitre || 'Mes réalisations, en ligne et consultables')}</p>
          <ul>${L.pieces
            .map((p) =>
              typeof p === 'string'
                ? `<li>${relief(p)}</li>`
                : `<li>${relief(p.quoi)} — ${lien(p.url)}</li>`,
            )
            .join('')}</ul>
        </div>`
      : ''
  }

  ${L.apresPieces ? `<p class="corps">${relief(L.apresPieces)}</p>` : ''}

  <div class="signature">
    <p class="corps">${relief(L.formule || '')}</p>
    <p class="nom">${esc(L.expediteur?.nom)}</p>
  </div>

  <p class="pied">
    ${[
      L.expediteur?.site && lien(L.expediteur.site),
      L.expediteur?.github && lien(L.expediteur.github),
      L.expediteur?.linkedin && lien(L.expediteur.linkedin),
    ]
      .filter(Boolean)
      .join('<span class="sep">   ·   </span>')}
  </p>

</div></body></html>`;

mkdirSync(dirname(SORTIE), { recursive: true });
const tmpHtml = join(tmpdir(), `lettre-${process.pid}.html`);
writeFileSync(tmpHtml, html, 'utf8');

const navigateur = await puppeteer.launch({
  executablePath: chrome,
  headless: 'new',
  args: ['--no-sandbox', '--font-render-hinting=none'],
});
try {
  const page = await navigateur.newPage();
  await page.goto(`file://${tmpHtml.replace(/\\/g, '/')}`, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: SORTIE,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true,
  });
  const pdf = readFileSync(SORTIE);
  const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  const nom = SORTIE.replace(racine, '').replace(/^[\\/]/, '');
  console.log(`écrit : ${nom} — ${(statSync(SORTIE).size / 1024).toFixed(0)} Ko, ${pages} page(s)`);
  // Une lettre de motivation qui déborde sur une deuxième page ne se lit pas.
  if (pages > 1) console.warn('⚠ la lettre déborde sur une deuxième page — à raccourcir.');
} finally {
  await navigateur.close();
  rmSync(tmpHtml, { force: true });
}
