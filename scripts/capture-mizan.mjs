/**
 * Capture les écrans de Mizan pour la fiche projet du portfolio.
 *
 * Mizan répond sur le Code du travail marocain en citant ses articles. Son
 * argument n'est pas « une IA qui répond sur le droit » — il y en a des
 * centaines — mais : on mesure au lieu d'affirmer, et quand on ne sait pas, on
 * se tait. Les cinq images ci-dessous sont choisies pour montrer CELA, et
 * chacune porte en commentaire ce qu'elle est censée démontrer : dans six
 * mois, c'est la seule façon de savoir si une image est encore juste.
 *
 * Prérequis : le service tourne. Il vit dans un conteneur Docker, et il est
 * normalement déjà en route :
 *
 *   docker start mizan-vue
 *   curl http://localhost:7890/sante        -> {"pret":true, ...}
 *
 * puis, ici :
 *   node scripts/capture-mizan.mjs
 *   MIZAN_BASE=http://localhost:7890 node scripts/capture-mizan.mjs   (autre port)
 *   MIZAN_MESURES=1 node scripts/capture-mizan.mjs   (imprime les cadres)
 *
 * Pourquoi un script plutôt que des captures à la main, comme pour Artisans.ma
 * et Factura : les écrans bougeront, et des images prises à la main ne se
 * refont pas à l'identique. Celles-ci se rejouent d'une commande.
 *
 * AVERTISSEMENT QUI VAUT POUR TOUTES LES IMAGES : le dépôt ne contient aucune
 * clé de modèle. Le paragraphe rédigé est donc écrit par un modèle FACTICE, et
 * l'écran le dit — c'est même la moitié de ce que ces captures montrent. La
 * RECHERCHE des articles, elle, est réelle : c'est elle qui est mesurée.
 */
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ici = dirname(fileURLToPath(import.meta.url));
const DEST = join(ici, '..', 'public', 'projects');
mkdirSync(DEST, { recursive: true });

const BASE = process.env.MIZAN_BASE ?? 'http://localhost:7890';
const MESURES = !!process.env.MIZAN_MESURES;

const CHEMIN_CHROME =
  process.env.CHROME_PATH ??
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

/* ══ Stabilité ════════════════════════════════════════════════════════════ */

/**
 * N'autorise la capture qu'une fois la page immobile.
 *
 * Trois choses bougent encore après `networkidle2` et donneraient une image
 * floue ou à moitié peinte :
 *   • les polices — Mizan charge DM Sans et Azeret Mono depuis Google Fonts,
 *     et tant qu'elles n'ont pas remplacé la police de repli, les blocs de
 *     texte n'ont pas leur hauteur définitive ; un cadre calculé avant est
 *     calculé sur la mauvaise page ;
 *   • la peinture — deux `requestAnimationFrame` garantissent qu'une mise en
 *     page déclenchée par l'arrivée des polices a été rendue ;
 *   • les transitions CSS, traitées en amont : on émule
 *     `prefers-reduced-motion: reduce`, que `mizan.css` honore déjà (il coupe
 *     le battement de la pastille d'attente et ramène toutes les transitions
 *     à 0,01 ms). On ne désactive donc rien d'extérieur à la page : on lui
 *     demande le mode qu'elle sait servir.
 */
async function attendreStabilite(page) {
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.status !== 'loaded') {
      await document.fonts.ready;
    }
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  });
}

/* La bande horizontale commune aux cinq images.
 *
 * La fenêtre fait 1440 px — c'est la largeur des autres scripts de capture du
 * dépôt, et c'est elle qui décide de la mise en page que Mizan sert. Mais la
 * colonne de contenu, elle, est étroite : 58 rem dans l'application, 60 rem
 * dans le tutoriel. Photographier les 1440 px laisserait 38 % de fond noir
 * vide de chaque côté, et l'idée de l'image occuperait le reste.
 *
 * On capture donc une bande centrée de 1000 px, identique pour les cinq : la
 * fiche projet les affiche à la même échelle, et chacune reste lisible. Si
 * l'une des colonnes dépassait un jour de cette bande, `cadre` le dit et
 * s'arrête — mieux vaut une image manquante qu'une image rognée en silence.
 */
const BANDE = { x: 220, largeur: 1000 };

/**
 * Calcule un cadre serré autour de ce que l'image doit dire.
 *
 * Une capture pleine page où l'idée occupe 10 % de la hauteur ne montre rien :
 * chaque écran déclare donc son premier et son dernier élément, et le cadre
 * est l'union verticale de leurs rectangles, élargie d'une marge. Les marges
 * sont réglables séparément en haut et en bas : une marge généreuse ramène
 * dans l'image la ligne de texte qui précède, ce qui donne une bande coupée
 * en deux au lieu d'un cadre net.
 *
 * `clip` est en pixels CSS ; `deviceScaleFactor: 2` double la taille du
 * fichier rendu, pas les coordonnées.
 */
async function cadre(page, premier, dernier, marge = 24, margeBas = marge) {
  const rect = await page.evaluate(
    (sPremier, sDernier) => {
      const haut = document.querySelector(sPremier);
      const bas = document.querySelector(sDernier);
      if (!haut || !bas) return null;
      const a = haut.getBoundingClientRect();
      const b = bas.getBoundingClientRect();
      const defilement = window.scrollY;
      return {
        y: Math.min(a.top, b.top) + defilement,
        bas: Math.max(a.bottom, b.bottom) + defilement,
        gauche: Math.min(a.left, b.left),
        droite: Math.max(a.right, b.right),
      };
    },
    premier,
    dernier,
  );
  if (!rect) throw new Error(`cadre introuvable : « ${premier} » → « ${dernier} »`);

  if (rect.gauche < BANDE.x || rect.droite > BANDE.x + BANDE.largeur) {
    throw new Error(
      `le contenu (${Math.round(rect.gauche)} → ${Math.round(rect.droite)} px) ` +
        `déborde de la bande capturée (${BANDE.x} → ${BANDE.x + BANDE.largeur}) : ` +
        'la mise en page a changé, il faut élargir BANDE.',
    );
  }

  const y = Math.max(0, Math.round(rect.y - marge));
  return {
    x: BANDE.x,
    y,
    width: BANDE.largeur,
    height: Math.round(rect.bas + margeBas) - y,
  };
}

async function photographier(page, nom, clip) {
  if (MESURES) console.log(`  ${nom}: cadre ${clip.width}×${clip.height} à y=${clip.y}`);
  await page.screenshot({
    path: join(DEST, `${nom}.jpg`),
    type: 'jpeg',
    quality: 88,
    clip,
  });
  console.log(`  ${nom}.jpg`);
}

/* ══ Poser une question ═══════════════════════════════════════════════════ */

/**
 * Tape la question et attend le verdict.
 *
 * On écrit dans le champ au lieu de cliquer une des puces d'exemple : les
 * puces portent leurs propres formulations, et une capture doit montrer la
 * question que la fiche projet annonce, mot pour mot. L'événement `input` est
 * indispensable — `mizan.js` ne dégrise le bouton que sur cet événement, et
 * poser `value` seul laisserait un bouton désactivé.
 */
async function poserLaQuestion(page, question) {
  await page.waitForSelector('#question');
  await page.$eval(
    '#question',
    (champ, texte) => {
      champ.value = texte;
      champ.dispatchEvent(new Event('input', { bubbles: true }));
    },
    question,
  );
  await page.waitForFunction(() => !document.getElementById('envoyer').disabled);
  await page.click('#envoyer');

  // Le verdict est le seul nœud qui soit présent dans les trois registres
  // (réponse, abstention, rejet) ; `.attente` est l'écran de recherche. Tant
  // que le second est là, la réponse n'est pas arrivée.
  await page.waitForFunction(
    () =>
      !!document.querySelector('#sortie .verdict') &&
      !document.querySelector('#sortie .attente'),
    { timeout: 120_000 },
  );
  await attendreStabilite(page);
}

/* ══ Les cinq écrans ══════════════════════════════════════════════════════ */

const ECRANS = [
  {
    /* mizan.jpg — L'ACCUEIL, et l'image de couverture.
     *
     * CE QU'ELLE DOIT MONTRER : que le système annonce ses limites AVANT
     * qu'on lui parle. Les deux bandeaux permanents en haut (le corpus n'est
     * pas l'état du droit en vigueur ; la rédaction affichée est factice) et
     * la boîte de question juste en dessous.
     *
     * SI ELLE CESSE D'ÊTRE JUSTE : si le bandeau factice a disparu parce
     * qu'une clé de modèle a été fournie au service, cette image ne démontre
     * plus la moitié de ce qu'elle promet — il faudra la reprendre sans clé,
     * ou changer ce qu'en dit la fiche projet.
     */
    nom: 'mizan',
    chemin: '/',
    async preparer(page) {
      // Les bandeaux sont remplis par `/api/etat`, pas par le balisage : la
      // date du corpus et le « pourquoi » de la rédaction factice ont une
      // source unique, et la page attend sa réponse. Photographier avant,
      // c'est photographier une page qui n'a encore rien avoué.
      await page.waitForFunction(
        () => {
          const factice = document.getElementById('bandeau-factice');
          const pourquoi = document.getElementById('pourquoi-factice');
          return factice && !factice.hidden && (pourquoi?.textContent ?? '').length > 0;
        },
        { timeout: 60_000 },
      );
      // La date de consolidation remonte dans le pied de page par la même
      // route : tant qu'elle vaut « — », l'état n'est pas entièrement peint.
      await page.waitForFunction(
        () => (document.getElementById('corpus-date')?.textContent ?? '—') !== '—',
        { timeout: 60_000 },
      );
    },
    cadre: (page) => cadre(page, '.entete', '.poser__pied', 18),
  },

  {
    /* mizan-reponse.jpg — UNE RÉPONSE.
     *
     * CE QU'ELLE DOIT MONTRER : le bandeau vert « Le Code répond », le
     * paragraphe rédigé AVEC sa pastille RÉDACTION FACTICE collée dessus, et
     * les pastilles d'articles cités en or. L'aveu n'est pas relégué en haut
     * de page : il est sur la seule zone qui soit fausse.
     *
     * SI ELLE CESSE D'ÊTRE JUSTE : si la recherche ne renvoie plus l'article
     * 231 en tête sur cette question, le paragraphe et les pastilles citeront
     * autre chose — l'image resterait honnête, mais la fiche projet ne doit
     * plus annoncer « article 231 ».
     */
    nom: 'mizan-reponse',
    chemin: '/',
    question: 'Combien de jours de congé après deux ans chez le même employeur ?',
    // Le cadre part du rappel de la question, pas du verdict : sans lui, on
    // voit une réponse sans savoir à quoi, et la ligne se retrouve coupée en
    // deux en haut de l'image.
    cadre: (page) => cadre(page, '#sortie .rappel-question', '#sortie .citations', 18, 22),
  },

  {
    /* mizan-article.jpg — UN ARTICLE AVEC SA POSITION.
     *
     * CE QU'ELLE DOIT MONTRER : l'article 231 avec sa position hiérarchique
     * complète (Livre II / Titre III / Chapitre IV / Section I), son texte, le
     * bras de recherche qui l'a trouvé et la page du PDF source. En droit, un
     * article sans son chapitre ne veut pas dire la même chose : c'est pour ça
     * que la position est affichée en entier, et en or.
     *
     * Le cadre vise `#article-231` nommément. Si la recherche ne le remonte
     * plus, le script s'arrête au lieu de livrer la carte d'un autre article
     * sous un nom qui promettait celle-là.
     */
    nom: 'mizan-article',
    chemin: '/',
    question: 'Combien de jours de congé après deux ans chez le même employeur ?',
    async preparer(page) {
      await page.waitForSelector('#article-231', { timeout: 10_000 });
      // L'article 231 fait moins que le seuil de repli du produit : son texte
      // est entier sans qu'on touche à rien. On vérifie quand même, plutôt que
      // de livrer une image où le texte est coupé derrière un bouton.
      const replie = await page.$('#article-231 .article__texte--plie');
      if (replie) await page.click('#article-231 .deplier');
      await page.evaluate(() =>
        document.getElementById('article-231').scrollIntoView({ block: 'center', behavior: 'instant' }),
      );
      await attendreStabilite(page);
    },
    // Marge courte : les cartes voisines sont à une douzaine de pixels, et une
    // marge large en ferait entrer des tranches qui ne disent rien.
    cadre: (page) => cadre(page, '#article-231', '#article-231', 10),
  },

  {
    /* mizan-silence.jpg — LE SILENCE, l'image la plus importante du lot.
     *
     * CE QU'ELLE DOIT MONTRER : le système se tait, dit POURQUOI avec le
     * chiffre de proximité et son seuil, et montre quand même ses candidats
     * en les étiquetant « candidat » — pas comme la réponse. C'est l'argument
     * central du projet : une abstention bien présentée vaut mieux qu'une
     * réponse fausse bien présentée.
     *
     * Le cadre descend jusqu'au PREMIER article candidat, et pas plus loin :
     * l'étiquette « candidat » et l'avis qui la surplombe sont ce qu'il faut
     * voir ; les quatre autres cartes ne rajouteraient que de la hauteur.
     *
     * SI ELLE CESSE D'ÊTRE JUSTE : si cette question passait au-dessus du
     * seuil de proximité, l'écran répondrait et l'image ne montrerait plus
     * rien de ce qu'elle promet. Le script le détecte : il exige
     * `.verdict--doute`.
     */
    nom: 'mizan-silence',
    chemin: '/',
    question: 'Comment déclarer mes revenus fonciers ?',
    async preparer(page) {
      const abstenu = await page.$('#sortie .verdict--doute');
      if (!abstenu) {
        throw new Error(
          'mizan-silence : le service a RÉPONDU à « Comment déclarer mes revenus ' +
            'fonciers ? » au lieu de se taire. L\'image ne montrerait pas ' +
            'l\'abstention : rien n\'est écrit.',
        );
      }
      await page.evaluate(() =>
        document.querySelector('#sortie .verdict').scrollIntoView({ block: 'start', behavior: 'instant' }),
      );
      await attendreStabilite(page);
    },
    cadre: (page) => cadre(page, '#sortie .rappel-question', '#sortie .article', 18, 10),
  },

  {
    /* mizan-tutoriel.jpg — LE TUTORIEL INTERACTIF.
     *
     * CE QU'ELLE DOIT MONTRER : le moment où le tutoriel rend tangible la
     * garde des citations — la seule vraie garantie du projet. On fait citer
     * au rédacteur deux articles qui SONT dans l'ensemble récupéré et un qui
     * n'y est pas (le 1098, qui existe mais dans un autre code), et la page
     * affiche le rejet, la phrase rendue par la vraie garde, et le calcul
     * d'inclusion d'ensembles qui l'a produit. Ce n'est pas un filtre de
     * probabilité : c'est une appartenance à un ensemble, vérifiée.
     *
     * SI ELLE CESSE D'ÊTRE JUSTE : le script vérifie que le verdict porte
     * bien `rejete`. Si les jetons de démonstration changent de numéro dans
     * `tutoriel.html`, c'est ici qu'il faut les mettre à jour.
     */
    nom: 'mizan-tutoriel',
    chemin: '/tutoriel.html',
    async preparer(page) {
      await page.waitForSelector('#jetons .jeton');

      // Deux citations légitimes et une inventée : le rejet ne doit pas
      // pouvoir se lire comme « il refuse tout ». On bascule par `aria-pressed`
      // plutôt qu'en cliquant à l'aveugle — les boutons sont des bascules, et
      // un clic de trop annulerait le précédent.
      const VOULUS = ['269', '270', '1098'];
      await page.evaluate((voulus) => {
        for (const bouton of document.querySelectorAll('#jetons .jeton')) {
          const cle = bouton.dataset.cle;
          if (cle === '__rien') continue;
          const choisi = bouton.getAttribute('aria-pressed') === 'true';
          if (voulus.includes(cle) !== choisi) bouton.click();
        }
      }, VOULUS);

      await page.waitForFunction(
        () => document.getElementById('garde-verdict')?.classList.contains('rejete'),
        { timeout: 10_000 },
      );
      await page.evaluate(() =>
        document.getElementById('jetons').scrollIntoView({ block: 'center', behavior: 'instant' }),
      );
      await attendreStabilite(page);
    },
    // Du titre « Maintenant, faites citer le rédacteur » au verdict : la
    // consigne, les jetons, le texte rédigé et le calcul d'inclusion dans un
    // seul cadre. Marge basse courte, sinon la première ligne du paragraphe
    // suivant entre dans l'image, coupée par le milieu.
    cadre: (page) => cadre(page, '#garde .carte h3', '#garde-verdict', 20, 12),
  },
];

/* ══ Exécution ════════════════════════════════════════════════════════════ */

// Un échec par écran, et non un échec global : mieux vaut quatre images justes
// et un message qui dit laquelle manque, qu'une cinquième image décorative qui
// ne démontre rien.
const echecs = [];

const navigateur = await puppeteer.launch({
  executablePath: CHEMIN_CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

try {
  const page = await navigateur.newPage();
  await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 2 });
  // Voir `attendreStabilite` : `mizan.css` honore déjà ce mode, on le lui
  // demande au lieu de neutraliser ses animations de l'extérieur.
  await page.emulateMediaFeatures([
    { name: 'prefers-reduced-motion', value: 'reduce' },
  ]);

  for (const ecran of ECRANS) {
    try {
      await page.goto(`${BASE}${ecran.chemin}`, { waitUntil: 'networkidle2' });
      await attendreStabilite(page);
      if (ecran.question) await poserLaQuestion(page, ecran.question);
      if (ecran.preparer) await ecran.preparer(page);
      await photographier(page, ecran.nom, await ecran.cadre(page));
    } catch (echec) {
      echecs.push(`${ecran.nom}.jpg : ${echec.message}`);
      console.error(`  ÉCHEC ${ecran.nom}.jpg — ${echec.message}`);
    }
  }
} finally {
  await navigateur.close();
}

console.log(`\nCaptures écrites dans ${DEST}`);
if (echecs.length) {
  console.error(`\n${echecs.length} capture(s) manquante(s) :`);
  for (const e of echecs) console.error(`  • ${e}`);
  process.exitCode = 1;
}
