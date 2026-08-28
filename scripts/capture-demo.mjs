/**
 * Capture les écrans des démonstrations d'outils métier (Project Tracker,
 * HR Recrutement) pour les pages de démo guidée du portfolio.
 *
 * Ces applications ne sont PAS publiées : elles tournent en local, sur un
 * DATA_DIR de démonstration peuplé de données entièrement fictives. Aucune
 * donnée réelle — candidats, appels d'offres, clients — n'apparaît, et la
 * production n'est jamais sollicitée.
 *
 * Usage : node scripts/capture-demo.mjs <tracker|rh> [nom-d-ecran]
 *   Les serveurs locaux doivent tourner (voir DEMO.md).
 */
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ici = dirname(fileURLToPath(import.meta.url));
const DEST = join(ici, '..', 'public', 'demo');
mkdirSync(DEST, { recursive: true });

const SUITES = {
  tracker: {
    base: 'http://127.0.0.1:8091',
    ecrans: [
      { nom: 'tracker-tableau-de-bord', chemin: '/' },
      { nom: 'tracker-projets', chemin: '/ao' },
      { nom: 'tracker-documentation', chemin: '/documentation' },
    ],
  },
  rh: {
    base: 'http://127.0.0.1:8092',
    // L'app RH exige une session : on se connecte avec le compte de demo
    // avant de photographier quoi que ce soit.
    connexion: { username: 'demo', password: 'demo2026' },
    ecrans: [
      { nom: 'rh-tableau-de-bord', chemin: '/' },
      { nom: 'rh-recrutement', chemin: '/recrutement' },
      { nom: 'rh-suivi', chemin: '/', onglet: 'Tableau de suivi' },
    ],
  },
};

const suite = SUITES[process.argv[2]];
if (!suite) {
  console.error('Usage : node scripts/capture-demo.mjs <tracker|rh> [nom-d-ecran]');
  process.exit(1);
}
const filtre = process.argv[3];
const ecrans = filtre ? suite.ecrans.filter((e) => e.nom === filtre) : suite.ecrans;

const nav = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--hide-scrollbars'],
});

try {
  for (const e of ecrans) {
    const page = await nav.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

    process.stdout.write(`· ${e.nom} … `);
    if (suite.connexion) {
      // Poser la session via l'API : plus fiable que de remplir le formulaire.
      await page.goto(suite.base + '/login', { waitUntil: 'domcontentloaded', timeout: 60_000 });
      await page.evaluate(async (ids) => {
        await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ids),
        });
      }, suite.connexion);
    }
    await page.goto(suite.base + e.chemin, { waitUntil: 'networkidle2', timeout: 60_000 });
    await new Promise((r) => setTimeout(r, 2500));

    // Le tutoriel de première visite s'ouvre par-dessus l'écran : on le passe.
    await page.evaluate(() => {
      // Anonymisation : l'outil RH est bâti pour un client nommé, dont le nom
      // est codé en dur. Un portfolio personnel n'a pas à publier le nom d'un
      // tiers sans son accord — on le neutralise à la capture, sans toucher
      // au code de l'application.
      const marcheur = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const aRemplacer = [];
      while (marcheur.nextNode()) {
        if (/M2CG/i.test(marcheur.currentNode.nodeValue || '')) aRemplacer.push(marcheur.currentNode);
      }
      for (const n of aRemplacer) {
        n.nodeValue = n.nodeValue
          .replace(/M2CG\s+INGENIERIE/gi, 'SOCIÉTÉ CLIENTE')
          .replace(/M2CG/gi, 'le client');
      }
      const passer = [...document.querySelectorAll('button')].find((b) => /passer/i.test(b.textContent || ''));
      if (passer) passer.click();
      // Le bouton d'aide flottant n'apporte rien à une capture.
      for (const el of document.querySelectorAll('button, a')) {
        const s = getComputedStyle(el);
        if (s.position === 'fixed' && el.getBoundingClientRect().bottom > innerHeight - 90) el.remove();
      }
    });
    // Certains ecrans vivent derriere un onglet plutot qu'une URL.
    if (e.onglet) {
      await page.evaluate((libelle) => {
        const b = [...document.querySelectorAll('button, a, [role="tab"]')]
          .find((x) => (x.textContent || '').trim().includes(libelle));
        if (b) b.click();
      }, e.onglet);
      await new Promise((r) => setTimeout(r, 1800));
    }
    await new Promise((r) => setTimeout(r, 900));

    await page.screenshot({ path: join(DEST, `${e.nom}.jpg`), type: 'jpeg', quality: 90 });
    console.log('ok');
    await page.close();
  }
} finally {
  await nav.close();
}
console.log('\nCaptures de démo à jour.');
