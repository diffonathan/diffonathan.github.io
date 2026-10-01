/**
 * Capture les écrans de RDV Santé pour la fiche projet du portfolio.
 *
 * Comme Factura, RDV Santé n'est pas déployée en permanence : aucun hébergeur
 * gratuit ne garde un conteneur en vie sans carte bancaire. Elle tourne donc
 * en local, sur un jeu de démonstration dont les cliniques, les praticiens et
 * les patients sont inventés. Aucune donnée réelle n'apparaît sur ces images.
 *
 * Prérequis — le profil « démo », qui réunit les trois services dans un seul
 * processus et sert le front Angular construit :
 *
 *   docker compose -f deploy/compose/infra.yml up -d        (PostgreSQL)
 *   cd web && npm run build
 *   java -jar services/demo/target/demo-0.1.0-SNAPSHOT.jar \
 *        --server.port=8099 \
 *        --spring.web.resources.static-locations=file:web/dist/web/browser/
 *
 * puis, ici :
 *   RDV_BASE=http://localhost:8099 node scripts/capture-rdv-sante.mjs
 *
 * Pourquoi un script plutôt que des captures à la main : les trois images
 * existantes avaient été prises à la main, et rien ne permettait de les
 * refaire à l'identique quand la charte bouge. Celles-ci se rejouent d'une
 * commande.
 */
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ici = dirname(fileURLToPath(import.meta.url));
const DEST = join(ici, '..', 'public', 'projects');
mkdirSync(DEST, { recursive: true });

const BASE = process.env.RDV_BASE ?? 'http://localhost:8080';

/**
 * Angular lit la valeur du champ au moment de l'événement, pas la propriété.
 * Poser `el.value` sans émettre `input` laisse le formulaire réactif sur son
 * ancienne valeur — l'écran serait juste et le modèle faux. Même piège que
 * sur les champs `v-model` de Factura.
 */
function poserDansLaPage(el, valeur) {
  if (!el) return;
  el.value = valeur;
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

const ECRANS = [
  {
    // L'écran que la fiche projet ne montrait pas : la salle d'attente et le
    // secrétariat y figuraient, mais pas le patient en train de réserver —
    // c'est-à-dire le geste qui justifie le produit.
    nom: 'rdv-sante-reservation',
    chemin: '/',
    attendre: '#clinique',
    preparer: async (page) => {
      // Un créneau choisi, pas le premier : le premier pourrait passer pour
      // une valeur par défaut. Celui-ci montre que la sélection est un acte.
      await page.evaluate(() => {
        const creneaux = [...document.querySelectorAll('button')].filter((b) =>
          /^\d\d:\d\d$/.test(b.textContent.trim()),
        );
        creneaux[3]?.click();
      });
      await new Promise((r) => setTimeout(r, 400));

      await page.evaluate((poserSource) => {
        const poser = new Function(`return (${poserSource})`)();
        poser(document.querySelector('#prenom'), 'Fatima Zahra');
        poser(document.querySelector('#nom'), 'El Idrissi');
        poser(document.querySelector('#tel'), '0661234567');
      }, poserDansLaPage.toString());

      await new Promise((r) => setTimeout(r, 400));
    },
  },
];

const filtre = process.argv[2];
const ecrans = filtre ? ECRANS.filter((e) => e.nom === filtre) : ECRANS;

const nav = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--hide-scrollbars'],
});

try {
  const page = await nav.newPage();
  await page.setViewport({ width: 1600, height: 1000 });

  for (const e of ecrans) {
    // La visite guidée s'ouvre à la première venue et couvre l'écran. On pose
    // sa trace AVANT le chargement : l'effacer après coup la laisserait
    // apparaître le temps d'une image.
    await page.evaluateOnNewDocument((revoir) => {
      try {
        if (revoir) localStorage.removeItem('rdv-sante:visite-vue');
        else localStorage.setItem('rdv-sante:visite-vue', 'oui');
      } catch {
        /* stockage indisponible : sans effet sur la capture */
      }
    }, Boolean(e.visite));

    await page.goto(`${BASE}${e.chemin}`, { waitUntil: 'networkidle0' });

    if (e.attendre) await page.waitForSelector(e.attendre, { timeout: 15_000 });
    if (e.visite) await page.waitForSelector('[role="dialog"], dialog', { timeout: 10_000 });
    if (e.preparer) await e.preparer(page);

    // Les fontes distantes et les transitions ont besoin d'un instant. Sans
    // cette pause, on photographie une page en cours d'apparition.
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 900));

    const fichier = join(DEST, `${e.nom}.jpg`);
    await page.screenshot({ path: fichier, type: 'jpeg', quality: 82 });
    console.log('écrit :', fichier);
  }
} finally {
  await nav.close();
}
