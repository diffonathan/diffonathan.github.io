/**
 * Régénère les visuels de la section « Projets » depuis les sites EN LIGNE.
 *
 * Les captures précédentes dataient de juillet 2026, donc d'avant la refonte
 * de charte : elles montraient encore l'ancien vert. Un portfolio qui affiche
 * ses produits dans un design qu'ils n'ont plus dessert son auteur.
 *
 * Ne capture que des pages PUBLIQUES : les intérieurs d'application demandent
 * un compte, et on ne met pas de données de membres dans un portfolio.
 *
 * Usage : node scripts/capture-projets.mjs [nom]
 *
 * Dépendance : puppeteer-core, volontairement PAS dans package.json — c'est un
 * script de maintenance occasionnel, pas une dépendance du site, et il pèse
 * lourd. S'il manque :
 *   npm i -D puppeteer-core
 * Chrome est piloté depuis l'installation système (chemin ci-dessous).
 */
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ici = dirname(fileURLToPath(import.meta.url));
const DEST = join(ici, '..', 'public', 'projects');
mkdirSync(DEST, { recursive: true });

const CIBLES = [
  {
    nom: 'confluenceterminal',
    url: 'https://confluenceterminal.hopetraders.fr/',
    attente: 9000, // le bandeau de cours TradingView met du temps a se peupler
    // La pop-up d'essai surgit après 4,5 s : on la marque comme déjà proposée
    // pour qu'elle ne masque pas la page.
    avant: (page) => page.evaluateOnNewDocument(() => {
      try { localStorage.setItem('ct-essai-propose', String(Date.now())); } catch { /* vide */ }
    }),
  },
  { nom: 'hopetraders', url: 'https://vip.hopetraders.fr/' },
  { nom: 'hopejournal-site', url: 'https://hopejournal.hopetraders.fr/' },
];

const filtre = process.argv[2];
const liste = filtre ? CIBLES.filter((c) => c.nom === filtre) : CIBLES;

const nav = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--hide-scrollbars'],
});

try {
  for (const c of liste) {
    const page = await nav.newPage();
    // 1280×800 en densité 2 : net sur écran Retina, et le ratio colle aux
    // cartes de la grille de projets.
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
    // Les fonds animés tournent en boucle : on les fige pour que deux
    // exécutions donnent la même image.
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    if (c.avant) await c.avant(page);

    process.stdout.write(`· ${c.nom} … `);
    await page.goto(c.url, { waitUntil: 'networkidle2', timeout: 90_000 });
    // Laisse les polices et les révélations au défilement se poser.
    // `attente` plus longue quand la page embarque un widget tiers : le
    // bandeau TradingView de ConfluenceTerminal se peuple bien après
    // networkidle2, et sortait en barres grises de chargement.
    await new Promise((r) => setTimeout(r, c.attente ?? 2500));

    // Les sites de production ouvrent des surcouches à l'arrivée — modale
    // d'offre, bannière d'installation PWA, bandeau de consentement. Elles
    // masquent justement ce qu'on vient photographier. On les retire du DOM
    // plutôt que de deviner leurs clés de stockage, qui changent avec le code.
    await page.keyboard.press('Escape');
    await page.evaluate(() => {
      for (const d of document.querySelectorAll('[role="dialog"], [aria-modal="true"]')) {
        // Remonter jusqu'au voile plein écran, sinon il reste un fond assombri.
        let cible = d;
        for (let i = 0; i < 3 && cible.parentElement; i++) {
          const p = cible.parentElement;
          const s = getComputedStyle(p);
          if (s.position === 'fixed' && parseInt(s.zIndex || '0', 10) > 10) cible = p;
          else break;
        }
        cible.remove();
      }
      // Bannières collées en bas ou en haut (installation PWA, cookies).
      for (const el of document.querySelectorAll('body *')) {
        const s = getComputedStyle(el);
        if (s.position !== 'fixed') continue;
        const r = el.getBoundingClientRect();
        const colleEnBas = r.bottom > innerHeight - 24 && r.height < innerHeight * 0.4;
        if (colleEnBas && parseInt(s.zIndex || '0', 10) > 10) el.remove();
      }
      document.body.style.overflow = ''; // la modale verrouillait le défilement
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: join(DEST, `${c.nom}.jpg`),
      type: 'jpeg',
      quality: 88,
    });
    console.log('ok');
    await page.close();
  }
} finally {
  await nav.close();
}
console.log('\nVisuels régénérés depuis la production.');
