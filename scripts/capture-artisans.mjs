/**
 * Capture les écrans d'Artisans.ma pour la fiche projet du portfolio.
 *
 * Comme Factura et RDV Santé, l'application n'est pas déployée en permanence :
 * aucun hébergeur gratuit ne garde un conteneur en vie sans carte bancaire, et
 * celle-ci demande en plus un MongoDB en replica set. Elle tourne donc en
 * local, sur le jeu de démonstration de `npm run semer` — artisans, clients et
 * chantiers inventés. Aucune donnée réelle n'apparaît sur ces images.
 *
 * Prérequis, depuis `Documents/Projet/artisans` :
 *
 *   docker compose up -d                  (MongoDB en replica set + Redis)
 *   cd api  && npm run semer && node dist/main.js      (API sur 3000)
 *   cd web  && npm run dev                             (front sur 3100)
 *
 * puis, ici :
 *   ARTISANS_BASE=http://localhost:3100 node scripts/capture-artisans.mjs
 *
 * Pourquoi un script plutôt que des captures à la main : la charte bouge, et
 * des images prises à la main ne se refont pas à l'identique. Celles-ci se
 * rejouent d'une commande.
 */
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ici = dirname(fileURLToPath(import.meta.url));
const DEST = join(ici, '..', 'public', 'projects');
mkdirSync(DEST, { recursive: true });

const BASE = process.env.ARTISANS_BASE ?? 'http://localhost:3100';

/** Comptes du jeu de démonstration (`api/src/outils/semer.ts`). */
const CLIENTE = { email: 'leila.amrani@exemple.ma', motDePasse: 'demonstration-2026' };
const ARTISAN = { email: 'karim.plomberie@exemple.ma', motDePasse: 'demonstration-2026' };

/**
 * React lit la valeur au moment de l'événement, pas la propriété.
 *
 * Poser `el.value` sans émettre `input` laisse l'état du composant sur son
 * ancienne valeur : l'écran serait juste et le modèle faux. Même piège que
 * sur les champs `v-model` de Factura et les formulaires réactifs d'Angular
 * dans RDV Santé — il se reproduit à chaque framework.
 */
function poserDansLaPage(el, valeur) {
  if (!el) return;
  const prototype = Object.getPrototypeOf(el);
  const descripteur = Object.getOwnPropertyDescriptor(prototype, 'value');
  // React remplace le setter natif de `value` : passer par celui du prototype
  // contourne son suivi interne, sans quoi il considère que rien n'a changé.
  if (descripteur?.set) descripteur.set.call(el, valeur);
  else el.value = valeur;
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

/** Ferme la visite guidée, qui s'ouvre d'elle-même à la première venue. */
async function fermerLaVisite(page) {
  await page.evaluate(() => {
    try {
      // La clé exacte est dans `components/visite-guidee/etapes.ts`.
      for (const cle of Object.keys(localStorage)) {
        if (cle.startsWith('artisans.ma:')) localStorage.setItem(cle, 'vue');
      }
    } catch {
      // Navigation privée : l'accès lève. La touche Échap prendra le relais.
    }
  });
  await page.keyboard.press('Escape').catch(() => {});
}

async function connecter(page, { email, motDePasse }) {
  // Vider la session AVANT : `/connexion` redirige un visiteur déjà connecté
  // vers sa destination de retour — c'est le comportement voulu de
  // l'application, et il fait disparaître le formulaire. Sans ce nettoyage,
  // la seconde connexion du script attend un champ qui ne viendra pas.
  const navigateurDeLaPage = page.browser();
  await navigateurDeLaPage.deleteCookie(...(await navigateurDeLaPage.cookies()));

  await page.goto(`${BASE}/connexion`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[type="email"]');
  await page.$eval('input[type="email"]', poserDansLaPage, email);
  await page.$eval('input[type="password"]', poserDansLaPage, motDePasse);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}),
    page.click('button[type="submit"]'),
  ]);
  await fermerLaVisite(page);
}

const ECRANS = [
  {
    // La thèse du produit, et le seul écran qui la montre sans l'expliquer :
    // un artisan à 168 km retenu, parce que SON rayon couvre le chantier.
    nom: 'artisans',
    chemin: '/recherche?metier=PEINTURE&ville=marrakech',
    attendre: 'main',
    session: null,
    // Le cadre est volontairement haut (1150 px) : la règle du produit et la
    // carte qui l'illustre doivent tenir ensemble. Faire défiler jusqu'aux
    // résultats montrait la carte mais coupait la règle — soit la moitié de
    // la démonstration.
  },
  {
    nom: 'artisans-recherche',
    chemin: '/recherche?metier=PLOMBERIE&ville=marrakech',
    attendre: 'main',
    session: null,
  },
  {
    // L'écran de décision du client : comparer des devis sur le montant, le
    // délai et la note, puis en accepter un — ce qui refuse les autres.
    nom: 'artisans-devis',
    chemin: '/mes-besoins',
    attendre: 'main',
    session: CLIENTE,
  },
  {
    // Le même produit vu de l'autre côté : les chantiers du rayon, SANS
    // adresse exacte — elle n'arrive qu'avec la réservation.
    nom: 'artisans-chantiers',
    chemin: '/chantiers',
    attendre: 'main',
    session: ARTISAN,
  },
  {
    // La page que lisent les recruteurs.
    nom: 'artisans-technique',
    chemin: '/technique',
    attendre: 'main',
    session: null,
  },
];

const CHEMIN_CHROME =
  process.env.CHROME_PATH ??
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const navigateur = await puppeteer.launch({
  executablePath: CHEMIN_CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

try {
  const page = await navigateur.newPage();
  await page.setViewport({ width: 1440, height: 1150, deviceScaleFactor: 2 });

  let sessionCourante = null;

  for (const ecran of ECRANS) {
    if (ecran.session !== sessionCourante) {
      if (ecran.session) await connecter(page, ecran.session);
      sessionCourante = ecran.session;
    }

    await page.goto(`${BASE}${ecran.chemin}`, { waitUntil: 'networkidle2' });
    await fermerLaVisite(page);
    await page.waitForSelector(ecran.attendre, { timeout: 15_000 });

    // Le contenu des frontières <Suspense> arrive en flux, après le squelette.
    // Sans cette attente, on photographie le chargement.
    await page
      .waitForFunction(
        () => !(document.querySelector('main')?.innerText ?? '').includes('en cours…'),
        { timeout: 15_000 },
      )
      .catch(() => {});

    if (ecran.defilerVers) {
      // On vise le paragraphe de décompte (« 1 artisan accepte de venir… »),
      // qui ouvre la liste : le cadrage part de lui et montre les résultats.
      await page.evaluate((selecteur) => {
        const cibles = [...document.querySelectorAll(selecteur)];
        const compte = cibles.find((e) => /artisans? accepten?t?/.test(e.textContent ?? ''));
        if (compte) compte.scrollIntoView({ block: 'center', behavior: 'instant' });
      }, ecran.defilerVers);
      await new Promise((r) => setTimeout(r, 400));
    }

    const destination = join(DEST, `${ecran.nom}.jpg`);
    await page.screenshot({ path: destination, type: 'jpeg', quality: 88 });
    console.log(`  ${ecran.nom}.jpg`);
  }
} finally {
  await navigateur.close();
}

console.log(`\nCaptures écrites dans ${DEST}`);
