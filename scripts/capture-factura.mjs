/**
 * Capture les écrans de Factura pour la fiche projet du portfolio.
 *
 * Factura n'est pas déployée : elle tourne en local, sur un jeu de
 * démonstration dont les entreprises et les clients sont entièrement
 * inventés. Aucune donnée réelle n'apparaît sur ces images.
 *
 * Prérequis : `docker compose up -d` dans Documents/Projet/factura, puis
 *   node scripts/capture-factura.mjs [nom-d-ecran]
 *
 * Pourquoi un script plutôt que des captures à la main : la fenêtre est
 * toujours de la même taille, les écrans sont toujours pris au même moment du
 * chargement, et on peut tout refaire d'un coup quand la charte change — ce
 * qui vient précisément d'arriver.
 */
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ici = dirname(fileURLToPath(import.meta.url));
const DEST = join(ici, '..', 'public', 'projects');
mkdirSync(DEST, { recursive: true });

const BASE = 'http://localhost:8000';
const COMPTE = { email: 'demo@factura.ma', motDePasse: 'demonstration' };

/**
 * Pose une valeur dans un champ lié par `v-model`, et PRÉVIENT Vue.
 *
 * Écrire `el.value` ne suffit pas : Vue ne surveille pas la propriété, il
 * écoute l'événement `input`. Sans lui, l'écran afficherait la bonne valeur
 * pendant que le modèle garde l'ancienne — et les totaux resteraient à zéro
 * sur une facture qui semble remplie. C'est le même piège que sur l'écran de
 * connexion, plus bas.
 */
function poserDansLePage(el, valeur) {
  if (!el) return;
  el.value = valeur;
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

const ECRANS = [
  { nom: 'factura', chemin: '/', attendre: '[data-visite="chiffres"]' },
  {
    // L'écran que la fiche projet ne montrait pas — alors que c'est l'endroit
    // où l'on fabrique une facture, donc le cœur du produit.
    //
    // On le photographie REMPLI : un formulaire vide ne prouve rien, tandis
    // qu'un document à deux lignes avec ses totaux calculés montre d'un coup
    // d'œil la remise, la TVA par ligne et le total TTC.
    nom: 'factura-creation',
    chemin: '/documents/nouveau',
    attendre: 'input[placeholder="Désignation"]',
    preparer: async (page) => {
      await page.evaluate(() => {
        const bouton = [...document.querySelectorAll('button')].find((b) =>
          b.textContent.includes('Ajouter une ligne'),
        );
        bouton?.click();
      });
      await page.waitForFunction(
        () => document.querySelectorAll('input[placeholder="Désignation"]').length >= 2,
        { timeout: 10_000 },
      );

      await page.evaluate((poserSource) => {
        const poser = new Function(`return (${poserSource})`)();

        poser(
          document.querySelector('input[placeholder="Refonte du site institutionnel"]'),
          'Refonte du site institutionnel',
        );

        // Un vrai devis de refonte : un forfait, puis des jours de formation.
        // Deux unités différentes, pour que la colonne « unité » ait un sens.
        const contenu = [
          ['Conception et intégration de la page d’accueil', '1', 'forfait', '18000'],
          ['Formation à l’outil de publication', '2', 'jour', '2500'],
        ];

        document.querySelectorAll('input[placeholder="Désignation"]').forEach((champ, i) => {
          const ligne = champ.closest('div.rounded-xl');
          if (!ligne || !contenu[i]) return;
          const champs = ligne.querySelectorAll('input');
          contenu[i].forEach((valeur, j) => poser(champs[j], valeur));
        });
      }, poserDansLePage.toString());

      // Les totaux sont calculés par Vue : on leur laisse un cycle de rendu.
      await new Promise((r) => setTimeout(r, 400));
    },
  },
  { nom: 'factura-document', chemin: '/documents/2', attendre: 'table' },
  { nom: 'factura-visite', chemin: '/', visite: true },
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

  // Connexion une fois pour toutes : la session tient pour les écrans suivants.
  await page.goto(`${BASE}/connexion`, { waitUntil: 'networkidle0' });

  // L'écran de connexion arrive avec les identifiants de démonstration DÉJÀ
  // saisis. Taper par-dessus ajoutait à la suite — on se connectait avec
  // « demo@factura.mademo@factura.ma », et le refus ressemblait à un défaut de
  // l'application. Le triple-clic censé tout sélectionner n'y changeait rien.
  //
  // On pose donc la valeur ET on émet `input` : sans cet événement, Vue ne
  // voit pas le changement, garde son ancienne valeur dans le modèle, et
  // envoie celle-là au serveur — le champ à l'écran serait juste. C'est le
  // piège de tout champ lié par `v-model`.
  for (const [champ, valeur] of [['#email', COMPTE.email], ['#mot_de_passe', COMPTE.motDePasse]]) {
    await page.$eval(champ, (el, v) => {
      el.value = v;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, valeur);
  }
  // Pas de `waitForNavigation` : Inertia ne recharge pas la page. Le
  // formulaire part en requête de fond, et le composant du tableau de bord
  // remplace celui de la connexion sans que le navigateur navigue. Attendre un
  // événement de navigation attendrait donc jusqu'au délai d'expiration.
  // On attend l'écran d'arrivée, qui est de toute façon ce qui nous intéresse.
  await page.click('button[type="submit"]');
  await page.waitForSelector('[data-visite="chiffres"]', { timeout: 20_000 });
  console.log('connecté');

  for (const e of ecrans) {
    // La visite guidée ne s'ouvre qu'à la première venue : on efface la trace
    // pour la revoir, ou on la pose pour photographier l'application seule.
    await page.evaluate((revoir) => {
      try {
        if (revoir) localStorage.removeItem('factura:visite-vue');
        else localStorage.setItem('factura:visite-vue', 'oui');
      } catch {
        /* stockage indisponible : sans effet sur la capture */
      }
    }, Boolean(e.visite));

    await page.goto(`${BASE}${e.chemin}`, { waitUntil: 'networkidle0' });

    if (e.attendre) await page.waitForSelector(e.attendre, { timeout: 10_000 });
    if (e.visite) await page.waitForSelector('[role="dialog"]', { timeout: 10_000 });
    if (e.preparer) await e.preparer(page);

    // Les fontes distantes et les transitions ont besoin d'un instant. Sans
    // cette pause, on photographie une page en cours d'apparition — texte à
    // demi transparent, cartes décalées de quelques pixels.
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 900));

    const fichier = join(DEST, `${e.nom}.jpg`);
    await page.screenshot({ path: fichier, type: 'jpeg', quality: 82 });
    console.log('écrit :', fichier);
  }
} finally {
  await nav.close();
}
