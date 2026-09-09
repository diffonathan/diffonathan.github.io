/**
 * CV PDF — modèle français à colonne latérale, rendu par Chrome.
 *
 * ── Pourquoi Chrome et pas une bibliothèque PDF ─────────────────────────────
 * Le texte doit rester SÉLECTIONNABLE : les logiciels de tri de candidatures
 * (ATS) extraient le texte du fichier, et un CV rasterisé en image leur est
 * invisible. printToPDF conserve le texte, les accents et les liens.
 *
 * ── Le compromis de la colonne latérale ─────────────────────────────────────
 * Une colonne latérale est ce qu'attend un lecteur français, mais les
 * extracteurs de texte peuvent entrelacer ses lignes avec celles du corps.
 * On limite les dégâts : la barre est déclarée APRÈS le contenu principal dans
 * le document et ramenée à gauche par la mise en page, si bien qu'une
 * extraction qui suit l'ordre du DOM lit d'abord l'expérience, puis la barre —
 * au lieu de les mélanger ligne à ligne. Le mode --colonne=non produit la
 * variante en une seule colonne, à envoyer quand l'offre passe par un ATS
 * strict.
 *
 * ── Fond ────────────────────────────────────────────────────────────────────
 * Le corps reste blanc : un CV s'imprime encore. Seule la barre porte un aplat,
 * et --theme=clair l'éclaircit pour les impressions économes.
 *
 * Usage : node scripts/gen-cv.mjs [options]
 *   --source=CHEMIN    contenu JSON            (défaut : src/data/cv.json)
 *   --sortie=CHEMIN    PDF produit             (défaut : public/cv.pdf)
 *   --theme=sombre|clair                       (défaut : sombre)
 *   --colonne=oui|non  barre latérale ou non   (défaut : oui)
 *   --sans-photo       retire le portrait
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
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
const SOURCE = resolve(opt.source || join(racine, 'src', 'data', 'cv.json'));
const SORTIE = resolve(opt.sortie || join(racine, 'public', 'cv.pdf'));
const SOMBRE = (opt.theme || 'sombre') !== 'clair';
const COLONNE = (opt.colonne || 'oui') !== 'non';
const PHOTO = !opt['sans-photo'];

/** Chrome du système : puppeteer-core n'embarque aucun navigateur. */
const CHROMES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  `${process.env.LOCALAPPDATA || ''}/Google/Chrome/Application/chrome.exe`,
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];
const chrome = CHROMES.find((p) => p && existsSync(p));
if (!chrome) throw new Error('Chrome introuvable — installez-le ou complétez CHROMES.');

// Charte : le bleu porte l'action, l'or la valeur. Mêmes valeurs que le site.
const BLEU = '#0781FE';
const OR = '#F9A825';
const ENCRE = '#111116';
const TEXTE = '#2b2b31';
const GRIS = '#5c5c66';
const FILET = '#e2e2e8';

/** La barre : aplat sombre de la charte, ou beige proche du CV d'origine. */
const BARRE = SOMBRE
  ? { fond1: '#14141b', fond2: '#0c0c11', texte: '#e8e8ec', attenue: '#9a9aa6',
      filet: 'rgba(255,255,255,0.12)', titre: '#ffffff', bord: 'rgba(255,255,255,0.16)' }
  : { fond1: '#f3f1ec', fond2: '#e8e5de', texte: '#25252b', attenue: '#5f5f68',
      filet: 'rgba(0,0,0,0.10)', titre: ENCRE, bord: 'rgba(0,0,0,0.10)' };

const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Complète le protocole quand le JSON n'en porte pas. */
const url = (u) => (/^https?:|^mailto:|^tel:/.test(u) ? u : `https://${u}`);

/** Les fragments entre astérisques passent en gras : le JSON met en relief un
 *  fait sans avoir à écrire de HTML. */
// Gère **double** AVANT *simple* : sans cela, `**mot**` laissait une paire
// d'astérisques visibles autour du gras, la syntaxe markdown la plus
// spontanée étant justement la double.
const relief = (s) =>
  esc(s)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<strong>$1</strong>');

const cv = JSON.parse(readFileSync(SOURCE, 'utf8'));

/**
 * Le portrait est encodé en data-URI : le HTML est rendu depuis le dossier
 * temporaire, un chemin relatif vers public/ n'y résoudrait pas.
 */
let portrait = '';
const photoPath = join(racine, 'public', 'profile.jpg');
if (PHOTO && existsSync(photoPath)) {
  portrait = `data:image/jpeg;base64,${readFileSync(photoPath).toString('base64')}`;
}

/**
 * Les seuls libellés que le gabarit posait lui-même. Écrits en dur, ils
 * restaient en français dans une version anglaise du CV, à côté de sections
 * traduites — l'incohérence la plus visible d'un document bilingue.
 */
const L = {
  contact: cv.libelles?.contact ?? 'Contact',
  langues: cv.libelles?.langues ?? 'Langues',
};

/**
 * Sections qui partent dans la barre ; le reste va au corps principal.
 *
 * La formation en est volontairement ABSENTE : trois diplômes ne tiennent pas
 * dans les 47 mm utiles du bandeau, et `overflow: hidden` les tronquait sans
 * rien dire. Elle a sa place en pleine largeur, où les intitulés respirent.
 */
const DANS_BARRE = new Set(['competences', 'langues', 'atouts']);
const enBarre = COLONNE ? (cv.sections || []).filter((s) => DANS_BARRE.has(s.id)) : [];
const enCorps = (cv.sections || []).filter((s) => !enBarre.includes(s));

/**
 * Le contact devient une liste de LIENS.
 *
 * Chrome transforme chaque <a href> en annotation de lien dans le PDF : le
 * lecteur clique sur l'e-mail et sa messagerie s'ouvre, sur le téléphone et
 * l'appel se compose. C'est du texte non cliquable qui coûte un contact, pas
 * l'inverse — et le CV se lit aujourd'hui plus souvent à l'écran que sur papier.
 *
 * `fort` met la ligne en avant : GitHub porte les sources, c'est le lien qu'un
 * lecteur technique cherche en premier.
 */

const contactLiens = [
  { texte: cv.contact?.lieu },
  {
    texte: cv.contact?.telephone,
    // tel: n'accepte pas les espaces de lecture : on repasse en E.164.
    href: cv.contact?.telephone && `tel:${String(cv.contact.telephone).replace(/[^+0-9]/g, '')}`,
  },
  { texte: cv.contact?.email, href: cv.contact?.email && `mailto:${cv.contact.email}` },
  { texte: cv.contact?.site, href: cv.contact?.site && url(cv.contact.site) },
  { texte: cv.contact?.github, href: cv.contact?.github && url(cv.contact.github), fort: true },
  { texte: cv.contact?.linkedin, href: cv.contact?.linkedin && url(cv.contact.linkedin) },
].filter((c) => c.texte);

/* ── Corps principal : frise verticale ────────────────────────────────────── */
/**
 * `lien` rend l'adresse du projet CLIQUABLE dans le PDF. Un recruteur qui lit à
 * l'écran ouvre l'outil en un clic ; recopier une adresse à la main, personne
 * ne le fait. Le protocole est ajouté si le JSON n'en porte pas.
 */
const entreeCorps = (e) => `
  <article class="entree">
    <header>
      <h3>${relief(e.titre)}</h3>
      ${e.meta ? `<span class="meta">${esc(e.meta)}</span>` : ''}
    </header>
    ${e.sousTitre ? `<p class="sous-titre">${relief(e.sousTitre)}</p>` : ''}
    ${
      e.lien
        ? `<p class="lien">${[].concat(e.lien)
            .map((u) => `<a href="${esc(url(u))}">${esc(u.replace(/^https?:\/\//, ''))}</a>`)
            .join('<span class="sep"> · </span>')}</p>`
        : ''
    }
    ${
      Array.isArray(e.lignes) && e.lignes.length
        ? `<ul>${e.lignes.map((l) => `<li>${relief(l)}</li>`).join('')}</ul>`
        : ''
    }
  </article>`;

/**
 * En mode une-colonne, les compétences retombent dans le corps : rendues comme
 * les autres entrées, chacune avec sa puce et sa marge, elles ajoutaient une
 * page entière. On les replie ici en lignes compactes — un groupe par ligne.
 */
const sectionCompacte = (s) => `
  <section class="bloc">
    <h2>${esc(s.titre)}</h2>
    <div class="frise"><article class="entree"><ul>${(s.entrees || [])
      .map((e) => `<li><strong>${esc(e.titre)}</strong> — ${(e.lignes || []).map(relief).join(' · ')}</li>`)
      .join('')}</ul></article></div>
  </section>`;

const sectionCorps = (s) =>
  !COLONNE && s.id === 'competences'
    ? sectionCompacte(s)
    : `
  <section class="bloc">
    <h2>${esc(s.titre)}</h2>
    <div class="frise">${(s.entrees || []).map(entreeCorps).join('')}</div>
  </section>`;

/* ── Barre latérale ───────────────────────────────────────────────────────── */
const entreeBarre = (e) => `
  <div class="b-entree">
    ${e.meta ? `<div class="b-meta">${esc(e.meta)}</div>` : ''}
    ${e.titre ? `<div class="b-titre">${relief(e.titre)}</div>` : ''}
    ${e.sousTitre ? `<div class="b-sous">${relief(e.sousTitre)}</div>` : ''}
    ${
      Array.isArray(e.lignes) && e.lignes.length
        ? `<ul class="b-liste">${e.lignes.map((l) => `<li>${relief(l)}</li>`).join('')}</ul>`
        : ''
    }
  </div>`;

const sectionBarre = (s) => `
  <section class="b-bloc">
    <h4>${esc(s.titre)}</h4>
    ${(s.entrees || []).map(entreeBarre).join('')}
  </section>`;

const barre = !COLONNE ? '' : `
  <aside class="barre">
    ${portrait ? `<img class="portrait" src="${portrait}" alt="">` : ''}
    <section class="b-bloc">
      <h4>${esc(L.contact)}</h4>
      <ul class="b-contact">${contactLiens
        .map((c) => {
          const t = esc(c.texte);
          const corps = c.href ? `<a href="${esc(c.href)}">${t}</a>` : t;
          return `<li${c.fort ? ' class="fort"' : ''}>${corps}</li>`;
        })
        .join('')}</ul>
    </section>
    ${
      Array.isArray(cv.langues) && cv.langues.length
        ? `<section class="b-bloc"><h4>${esc(L.langues)}</h4><ul class="b-liste">${cv.langues
            .map((l) => `<li><strong>${esc(l.langue)}</strong>${l.niveau ? ` — ${esc(l.niveau)}` : ''}</li>`)
            .join('')}</ul></section>`
        : ''
    }
    ${enBarre.map(sectionBarre).join('')}
  </aside>`;

const nomParts = (cv.nom || '').split(' ');
const prenom = nomParts.slice(0, -1).join(' ');
const patronyme = nomParts.slice(-1)[0] || '';

const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>${esc(cv.nom)} — CV</title>
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    font-size: 9.8pt; line-height: 1.40; color: ${TEXTE}; background: #fff;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }

  /* ── Barre latérale ───────────────────────────────────────────────────────
     position: fixed — Chrome répète l'élément sur CHAQUE page imprimée, ce qui
     donne une barre continue sans la dupliquer dans le document. */
  .barre {
    position: fixed; top: 0; left: 0; width: 62mm; height: 297mm;
    background: linear-gradient(160deg, ${BARRE.fond1} 0%, ${BARRE.fond2} 100%);
    color: ${BARRE.texte}; padding: 12mm 7.5mm 9mm; overflow: hidden;
  }
  /* Arête bleu→or : l'accent de la charte, à dose homéopathique. */
  .barre::after {
    content: ""; position: absolute; top: 0; right: 0; width: 2.2px; height: 100%;
    background: linear-gradient(180deg, ${BLEU} 0%, ${OR} 100%);
  }
  .portrait {
    display: block; width: 29mm; height: 29mm; border-radius: 50%;
    object-fit: cover; margin: 0 auto 7mm; border: 2.5px solid ${BARRE.bord};
  }
  .b-bloc { margin: 0 0 6mm; }
  .b-bloc h4 {
    margin: 0 0 2.6mm; font-size: 8.1pt; font-weight: 800; letter-spacing: 1.5px;
    text-transform: uppercase; color: ${BARRE.titre};
    padding-bottom: 1.4mm; border-bottom: 1px solid ${BARRE.filet};
  }
  .b-contact, .b-liste { list-style: none; margin: 0; padding: 0; }
  .b-contact li {
    font-size: 8.1pt; color: ${BARRE.attenue}; margin: 0 0 1.3mm;
    word-break: break-word; line-height: 1.35;
  }
  /* Pas de soulignement : six lignes soulignées feraient un pavé bleu. Le lien
     reste cliquable, il se signale par la couleur seule. */
  .b-contact a { color: inherit; text-decoration: none; }
  /* GitHub, mis en évidence : c'est le lien qu'un lecteur technique ouvre. */
  .b-contact li.fort {
    margin-top: 2mm; padding: 1.4mm 2mm; border-radius: 1.6mm;
    background: ${SOMBRE ? 'rgba(249,168,37,0.12)' : 'rgba(249,168,37,0.20)'};
    border: 1px solid ${SOMBRE ? 'rgba(249,168,37,0.34)' : 'rgba(180,120,20,0.34)'};
  }
  .b-contact li.fort a { color: ${SOMBRE ? OR : '#8a5d06'}; font-weight: 800; }
  .b-liste li {
    font-size: 8.1pt; color: ${BARRE.attenue}; margin: 0 0 1.6mm;
    padding-left: 3.2mm; position: relative; line-height: 1.36;
  }
  .b-liste li::before {
    content: ""; position: absolute; left: 0; top: 1.25mm;
    width: 1.4mm; height: 1.4mm; border-radius: 50%; background: ${OR};
  }
  .barre strong { color: ${BARRE.texte}; font-weight: 700; }
  .b-entree { margin: 0 0 3mm; }
  .b-titre { font-size: 8.4pt; font-weight: 700; color: ${BARRE.texte}; line-height: 1.3; }
  .b-sous { font-size: 7.9pt; color: ${BARRE.attenue}; }
  .b-meta { font-size: 7.7pt; color: ${OR}; font-weight: 800; letter-spacing: 0.4px; }

  /* ── Corps principal ─────────────────────────────────────────────────────── */
  .corps { margin-left: ${COLONNE ? '62mm' : '0'}; padding: 12mm 12mm 10mm ${COLONNE ? '9mm' : '15mm'}; }

  .entete { margin: 0 0 5mm; }
  h1 {
    margin: 0; font-size: 25pt; font-weight: 300; letter-spacing: -0.5px;
    color: ${ENCRE}; line-height: 1.02;
  }
  h1 span { font-weight: 800; display: block; }
  .titre {
    margin: 2.6mm 0 0; font-size: 10pt; font-weight: 700; color: ${BLEU};
    letter-spacing: 0.3px; text-transform: uppercase;
  }
  .regle { height: 2.4px; width: 21mm; background: ${OR}; margin: 2.8mm 0 0; border-radius: 2px; }

  .contact-ligne { margin: 3mm 0 0; font-size: 8.6pt; color: ${GRIS}; line-height: 1.6; }
  .contact-ligne span + span::before { content: " · "; color: ${FILET}; }
  .contact-ligne a { color: inherit; text-decoration: none; }
  .contact-ligne .fort a { color: #8a5d06; font-weight: 800; }

  .accroche { margin: 4.5mm 0 5.5mm; font-size: 9.6pt; color: ${TEXTE}; }

  .bloc { margin: 0 0 5mm; }
  .bloc h2 {
    margin: 0 0 3.2mm; font-size: 9.2pt; font-weight: 800; text-transform: uppercase;
    letter-spacing: 1.6px; color: ${ENCRE};
  }
  /* Frise verticale : le trait qui relie les postes, marque du modèle français. */
  .frise { position: relative; padding-left: 5.4mm; }
  .frise::before {
    content: ""; position: absolute; left: 1.25mm; top: 1.9mm; bottom: 1.5mm;
    width: 1px; background: ${FILET};
  }
  .entree { margin: 0 0 3.8mm; break-inside: avoid; page-break-inside: avoid; position: relative; }
  .entree:last-child { margin-bottom: 0; }
  .entree::before {
    content: ""; position: absolute; left: -4.95mm; top: 1.5mm;
    width: 2.6mm; height: 2.6mm; border-radius: 50%;
    background: #fff; border: 1.6px solid ${BLEU};
  }
  .entree header { display: flex; justify-content: space-between; align-items: baseline; gap: 4mm; }
  .entree h3 { margin: 0; font-size: 10.1pt; font-weight: 700; color: ${ENCRE}; }
  .entree .meta {
    font-size: 8.1pt; color: ${GRIS}; white-space: nowrap; font-weight: 700; letter-spacing: 0.2px;
  }
  .sous-titre { margin: 0.5mm 0 1.3mm; font-size: 8.9pt; color: ${BLEU}; font-weight: 600; }
  /* Le lien du projet : gris comme une note, mais cliquable. Le mettre en bleu
     entrerait en concurrence avec le sous-titre, déjà bleu. */
  .lien { margin: -0.6mm 0 1.3mm; font-size: 8.4pt; }
  .lien a { color: ${GRIS}; text-decoration: none; font-weight: 600; }
  .lien .sep { color: ${FILET}; }
  .entree ul { margin: 1.1mm 0 0; padding-left: 0; list-style: none; }
  .entree li { margin: 0 0 1mm; position: relative; padding-left: 3mm; }
  .entree li::before {
    content: ""; position: absolute; left: 0; top: 1.5mm;
    width: 1.3mm; height: 1.3mm; border-radius: 50%; background: ${OR};
  }
  .corps strong { color: ${ENCRE}; font-weight: 700; }
</style></head>
<body>

  <!-- Le corps vient AVANT la barre dans le document : une extraction de texte
       lit d'abord l'expérience, pas les coordonnées. -->
  <main class="corps">
    <header class="entete">
      <h1>${esc(prenom)}<span>${esc(patronyme)}</span></h1>
      <p class="titre">${esc(cv.titre)}</p>
      <div class="regle"></div>
      ${
        COLONNE
          ? ''
          : `<p class="contact-ligne">${contactLiens
              .map((c) => {
                const t = esc(c.texte);
                const corps = c.href ? `<a href="${esc(c.href)}">${t}</a>` : t;
                return `<span${c.fort ? ' class="fort"' : ''}>${corps}</span>`;
              })
              .join('')}</p>`
      }
    </header>
    ${cv.accroche ? `<p class="accroche">${relief(cv.accroche)}</p>` : ''}
    ${enCorps.map(sectionCorps).join('')}
    ${
      !COLONNE && Array.isArray(cv.langues) && cv.langues.length
        ? `<section class="bloc"><h2>${esc(L.langues)}</h2><div class="frise"><article class="entree"><ul>${cv.langues
            .map((l) => `<li><strong>${esc(l.langue)}</strong>${l.niveau ? ` — ${esc(l.niveau)}` : ''}</li>`)
            .join('')}</ul></article></div></section>`
        : ''
    }
  </main>

  ${barre}

</body></html>`;

mkdirSync(dirname(SORTIE), { recursive: true });
// Le HTML intermédiaire va dans le dossier temporaire du système, PAS à côté du
// PDF : écrit dans public/, il serait publié avec le site.
const tmpHtml = join(tmpdir(), `cv-${process.pid}.html`);
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
  // On compte les pages DANS le PDF produit : estimer la hauteur du document
  // ignore les sauts de page, et annonçait 2 pour un CV qui en faisait 4.
  // Le bandeau est en `overflow: hidden` : ce qui dépasse disparaît en silence.
  // On mesure avant de conclure, sinon un ajout de contenu se perd sans bruit.
  const debord = await page.evaluate(() => {
    const b = document.querySelector('.barre');
    if (!b) return 0;
    return Math.max(0, b.scrollHeight - b.clientHeight);
  });
  if (debord > 2) {
    console.warn(`⚠ le bandeau latéral déborde de ${Math.round(debord)} px : du contenu est coupé.`);
  }

  const pdf = readFileSync(SORTIE);
  const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  const nom = SORTIE.replace(racine, '').replace(/^[\\/]/, '');
  console.log(
    `écrit : ${nom} — ${(statSync(SORTIE).size / 1024).toFixed(0)} Ko, ${pages} page(s)` +
      ` · thème ${SOMBRE ? 'sombre' : 'clair'}${COLONNE ? ' · colonne latérale' : ' · une colonne'}`,
  );
  if (pages > 2) console.warn(`⚠ ${pages} pages : le contenu déborde des deux pages visées.`);
} finally {
  await navigateur.close();
  rmSync(tmpHtml, { force: true });
}

if (cv.questions?.length) {
  console.log('\nÀ trancher par Nathan :');
  cv.questions.forEach((q) => console.log('  ·', q));
}
