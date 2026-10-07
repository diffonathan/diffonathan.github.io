/**
 * Capture les écrans de Tasswiya pour la fiche projet du portfolio.
 *
 * Tasswiya pilote les délais de régularisation du chèque sans provision au
 * Maroc, sous la loi n° 71.24 (BO n° 7478 du 29 janvier 2026). Son argument
 * n'est pas « une application de gestion de délais » — il y en a partout —
 * mais trois choses qu'une capture peut montrer et qu'un paragraphe n'arrive
 * pas à faire croire :
 *
 *   1. les délais NE PARTENT PAS DU MÊME ÉVÉNEMENT, et l'écran nomme le point
 *      de départ de chacun avant d'afficher un nombre de jours ;
 *   2. un dossier change d'état SANS QUE PERSONNE NE CLIQUE, parce que le
 *      seul fait nouveau est le passage du temps ;
 *   3. le texte officiel a été lu, et il a démenti le cahier des charges : la
 *      prorogation n'est pas limitée à une fois, et ce que le produit limite
 *      est signalé comme SON choix et pas comme la loi.
 *
 * Les cinq images sont choisies pour montrer CELA, et chacune porte en
 * commentaire ce qu'elle est censée démontrer : dans six mois, c'est la seule
 * façon de savoir si une image est encore juste.
 *
 * AVERTISSEMENT QUI VAUT POUR LES CINQ IMAGES : Tasswiya n'est pas un conseil
 * juridique, les données sont fictives et aucun montant n'est opposable. Le
 * produit porte cette mention en haut de CHAQUE écran (`base.html.twig`), mais
 * les cadres ci-dessous sont serrés sur le contenu et ne l'embarquent donc
 * pas. La fiche projet doit la porter elle-même, à côté des images.
 *
 * Prérequis : le service tourne. PHP, Composer et la CLI Symfony sont absents
 * du poste — tout passe par Docker :
 *
 *   cd ../tasswiya && docker compose up -d
 *   curl -s -o /dev/null -w "%{http_code}" http://localhost:8001/   -> 200
 *
 * puis, ici :
 *   node scripts/capture-tasswiya.mjs
 *   TASSWIYA_BASE=http://localhost:8001 node scripts/capture-tasswiya.mjs
 *   TASSWIYA_MESURES=1 node scripts/capture-tasswiya.mjs   (imprime les cadres)
 *
 * Le script est relançable : il ne touche rien dans Tasswiya. Les cinq écrans
 * sont des GET, le curseur du tutoriel est une URL, et le décalage de
 * l'horloge de démonstration n'est jamais déplacé — ce qui veut dire que les
 * nombres de jours des images bougeront quand le jeu de données fictif sera
 * reconstruit, et que les nombres publiés dans la fiche projet ne doivent pas
 * être recopiés d'une capture.
 */
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ici = dirname(fileURLToPath(import.meta.url));
const DEST = join(ici, '..', 'public', 'projects');
mkdirSync(DEST, { recursive: true });

const BASE = process.env.TASSWIYA_BASE ?? 'http://localhost:8001';
const MESURES = !!process.env.TASSWIYA_MESURES;

const CHEMIN_CHROME =
  process.env.CHROME_PATH ??
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

/* Le dossier photographié, et pourquoi celui-là.
 *
 * CH-2026-0107 est le seul dossier fictif du jeu de données où les cinq
 * horloges courent ENSEMBLE depuis cinq faits datés différents, et où l'écart
 * entre elles se lit sans effort : une horloge déjà échue, une à quelques
 * jours, une à plusieurs années. Un dossier dont les délais seraient tous
 * lointains donnerait la même page et ne montrerait rien.
 *
 * Le script vérifie qu'il y a bien cinq horloges (voir l'écran `tasswiya`) :
 * si le jeu de données change, l'image doit changer de dossier plutôt que de
 * promettre cinq horloges et en montrer trois.
 */
const DOSSIER = process.env.TASSWIYA_DOSSIER ?? 'CH-2026-0107';

/* Les deux crans du tutoriel, de part et d'autre de l'échéance.
 *
 * 29 et 31 et non 30 : le dépassement est STRICT, donc le jour de l'échéance
 * le délai court encore. Un couple 30/31 marcherait aussi, mais 29/31 encadre
 * le basculement sans laisser croire que le jour J est déjà perdu. */
const AVANT = 29;
const APRES = 31;

/* ══ Stabilité ════════════════════════════════════════════════════════════ */

/**
 * Retire la barre de débogage de Symfony, et SEULEMENT elle.
 *
 * Le conteneur tourne en `APP_ENV=dev` (`tasswiya/.env`), et le WebProfiler
 * injecte sa barre dans chaque réponse HTML. Elle est en `position: fixed` au
 * bas de la fenêtre : dès qu'un cadre est plus haut que la fenêtre, elle
 * traverse l'image au milieu — c'est arrivé sur l'écran du dossier, en plein
 * travers de la deuxième horloge.
 *
 * Ce n'est pas du contenu du produit : c'est l'instrumentation du mode
 * développement, et elle n'existe pas dans l'image déployée. On la retire donc
 * du DOM, et on ne touche à rien d'autre — aucun style du produit n'est
 * neutralisé, aucun élément de l'écran n'est masqué pour « faire joli ».
 *
 * On vérifie ensuite qu'il n'en reste rien de visible : si Symfony change le
 * nom de ses classes, le script doit s'arrêter plutôt que de livrer cinq
 * images barrées d'un bandeau noir.
 */
async function retirerLOutilDeDeveloppement(page) {
  const restant = await page.evaluate(() => {
    for (const e of document.querySelectorAll('[id^="sfwdt"], .sf-toolbar, .sf-minitoolbar')) {
      e.remove();
    }
    return Array.from(document.querySelectorAll('[id^="sfwdt"], .sf-toolbar')).filter(
      (e) => e.offsetHeight > 0,
    ).length;
  });
  if (restant) {
    throw new Error(
      `la barre de débogage de Symfony est toujours visible (${restant} élément(s)) : ` +
        'elle traverserait les images. Le balisage du WebProfiler a changé.',
    );
  }
}

/**
 * N'autorise la capture qu'une fois la page immobile.
 *
 * Tasswiya ne télécharge AUCUNE police — les piles sont celles du système, par
 * refus d'une requête vers un hébergeur de polices. La cause habituelle de
 * cadre calculé sur la mauvaise page disparaît donc, mais on garde l'attente :
 * elle ne coûte rien, et si une police venait à être ajoutée le script
 * continuerait à produire des cadres justes au lieu de se tromper en silence.
 *
 * Deux `requestAnimationFrame` garantissent qu'une mise en page déclenchée
 * juste avant a été peinte. Les transitions CSS, elles, sont traitées en
 * amont : on émule `prefers-reduced-motion: reduce`, que `tasswiya.css` honore
 * déjà (il ramène toute transition à 0,01 ms). On ne neutralise donc rien
 * d'extérieur à la page : on lui demande le mode qu'elle sait servir.
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
 * dépôt, et c'est elle qui décide de la mise en page que Tasswiya sert (le
 * tutoriel passe ses deux volets côte à côte au-delà de 34 rem ; en dessous il
 * les empile, et le couple horloge + graphe ne serait plus « le même plan »).
 *
 * Mais la colonne de contenu, elle, est étroite : `.enveloppe` fait 56 rem,
 * soit 896 px, centrés. Photographier les 1440 px laisserait 19 % de fond vide
 * de chaque côté, et l'idée de l'image occuperait le reste. On capture donc
 * une bande centrée de 920 px — les 896 px de la colonne et 12 px d'air de
 * chaque côté —, identique pour les cinq : la fiche projet les affiche à la
 * même échelle, et chacune reste lisible.
 *
 * Si le contenu dépassait un jour de cette bande, `cadre` le dit et s'arrête :
 * mieux vaut une image manquante qu'une image rognée en silence.
 */
const BANDE = { x: 260, largeur: 920 };

/**
 * Désigne un élément de la page.
 *
 * Un sélecteur CSS suffit presque partout. Deux images font exception, et il
 * faut savoir pourquoi : les règles de droit sont rendues par un fragment Twig
 * unique (`partiel/_regle.html.twig`), volontairement sans identifiant — un
 * degré de certitude qui s'afficherait depuis deux endroits finirait par
 * s'afficher de deux manières. On les désigne donc par ce qu'elles DISENT :
 *
 *   { selecteur, contient?, avec?, rang? }
 *
 *   contient — un fragment de texte que l'élément doit porter ;
 *   avec     — des sélecteurs qui doivent exister À L'INTÉRIEUR de l'élément ;
 *   rang     — lequel prendre si plusieurs répondent (0 par défaut).
 *
 * C'est de la donnée et non une fonction : elle traverse `page.evaluate` sans
 * sérialisation acrobatique, et elle se lit dans la déclaration de l'écran.
 */
function resoudre(d) {
  // Exécuté DANS la page : pas de dépendance au contexte de Node.
  const desc = typeof d === 'string' ? { selecteur: d } : d;
  let liste = Array.from(document.querySelectorAll(desc.selecteur));
  if (desc.avec) liste = liste.filter((e) => desc.avec.every((s) => e.querySelector(s)));
  if (desc.contient) liste = liste.filter((e) => e.textContent.includes(desc.contient));
  return liste[desc.rang ?? 0] ?? null;
}

/**
 * Calcule un cadre serré autour de ce que l'image doit dire.
 *
 * Une capture pleine page où l'idée occupe 10 % de la hauteur ne montre rien :
 * chaque écran déclare donc son premier et son dernier élément, et le cadre
 * est l'union verticale de leurs rectangles, élargie d'une marge. Les marges
 * sont réglables séparément en haut et en bas : une marge généreuse ramène
 * dans l'image la ligne de texte qui précède, ce qui donne une bande coupée en
 * deux au lieu d'un cadre net.
 *
 * `clip` est en pixels CSS ; `deviceScaleFactor: 2` double la taille du
 * fichier rendu, pas les coordonnées.
 */
async function cadre(page, premier, dernier, marge = 24, margeBas = marge) {
  const rect = await page.evaluate(
    (dPremier, dDernier, sourceResoudre) => {
      // eslint-disable-next-line no-new-func
      const trouver = new Function(`return (${sourceResoudre})`)();
      const haut = trouver(dPremier);
      const bas = trouver(dDernier);
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
    resoudre.toString(),
  );
  if (!rect) {
    throw new Error(
      `cadre introuvable : « ${JSON.stringify(premier)} » → « ${JSON.stringify(dernier)} »`,
    );
  }

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

/** Compte les éléments qui répondent à un sélecteur — pour les vérifications. */
function compter(page, selecteur) {
  return page.$$eval(selecteur, (n) => n.length);
}

/** Ouvre un écran : la seule porte d'entrée, pour que rien ne saute l'une des
 *  trois étapes (charger, retirer l'instrumentation de dev, attendre). */
async function ouvrir(page, chemin) {
  await page.goto(`${BASE}${chemin}`, { waitUntil: 'networkidle2' });
  await retirerLOutilDeDeveloppement(page);
  await attendreStabilite(page);
}

/* ══ LE MOMENT — les deux images qui doivent se lire sans légende ═════════ */

/**
 * tasswiya-avant.jpg et tasswiya-apres.jpg — DANS LE MÊME CADRE.
 *
 * CE QUE CES DEUX IMAGES DOIVENT MONTRER, ENSEMBLE ET PAS SÉPARÉMENT :
 * qu'entre les deux, rien n'a été saisi et aucun bouton n'a été pressé. Le
 * seul fait nouveau est le passage du temps — et le dossier a changé d'état.
 *
 * À 29 jours, le compteur dit qu'il reste un jour et les quatre transitions
 * sortantes sont rayées. À 31, le compteur est passé au-delà de l'échéance et
 * UNE transition s'est ouverte : `expirer_delai`, marquée « par le temps »,
 * c'est-à-dire précisément celle que personne ne peut déclencher.
 *
 * ELLES SONT TRAITÉES À PART DES AUTRES ÉCRANS parce qu'elles partagent un
 * cadre, et que c'est tout l'effet : si les deux images n'étaient pas cadrées
 * au même pixel, le lecteur attribuerait la différence au recadrage. Donc :
 *
 *   • la hauteur est la PLUS GRANDE des deux hauteurs utiles, pas celle de la
 *     première page rencontrée — à 29 jours le volet de droite porte en plus
 *     la règle qui refuse, ce qui pousse le graphe vers le bas. CONSÉQUENCE
 *     ASSUMÉE : à 31 jours le contenu utile est plus court d'une centaine de
 *     pixels, et le cadre commun mord donc sur le début de l'encart suivant.
 *     C'est le prix du cadre identique, et c'est le bon prix : une bande de
 *     texte coupée en bas se voit moins qu'un recadrage, et un recadrage
 *     rendrait la démonstration discutable ;
 *   • l'ordonnée est vérifiée identique sur les deux pages. Elle doit l'être :
 *     tout ce qui précède le couple est le même balisage, au nombre « 29 » ou
 *     « 31 » près dans le champ. Si elle ne l'est plus, le script le dit et
 *     n'écrit rien — deux cadres différents présentés comme un seul seraient
 *     une démonstration truquée.
 *
 * SI ELLES CESSENT D'ÊTRE JUSTES : le script exige quatre transitions rayées
 * sur quatre à 29 jours, et exactement une ouverte sur quatre à 31. Si le
 * graphe de `workflow.yaml` gagne ou perd une transition sortante de
 * `ecedar_notifie`, ces nombres changent — et la fiche projet, qui les annonce,
 * doit changer avec eux.
 */
async function photographierLeMoment(page) {
  // Le couple horloge + graphe est le PREMIER `.tut-deux` de la page : celui
  // de la section « Le moment ». Le tutoriel en compte d'autres plus bas.
  const HAUT = { selecteur: '.tut-deux', rang: 0 };
  // Le bas du cadre est la fin du graphe « depuis ecedar_notifie », c'est-à-dire
  // la place où le dossier se trouvait quand on a interrogé le moteur. C'est là
  // que la transition se barre, et c'est la seule chose à regarder.
  const BAS = { selecteur: '.tut-deux .tut-graphe', rang: 0 };

  const mesures = {};
  for (const [moment, jours] of [['avant', AVANT], ['apres', APRES]]) {
    await ouvrir(page, `/tutoriel?jours=${jours}`);

    const total = await compter(page, '.tut-deux .tut-graphe:first-of-type .tut-transition');
    const rayees = await compter(
      page,
      '.tut-deux .tut-graphe:first-of-type .tut-transition--barree',
    );
    if (total !== 4) {
      throw new Error(
        `à ${jours} jours, le graphe depuis ecedar_notifie porte ${total} transitions ` +
          'sortantes et non 4 : le graphe a changé, et les deux images comme la fiche ' +
          'projet annoncent quatre.',
      );
    }
    if (moment === 'avant' && rayees !== 4) {
      throw new Error(
        `à ${jours} jours, ${rayees} transition(s) sur 4 sont rayées au lieu des 4 : ` +
          "l'image ne montrerait pas un dossier bloqué, et le second temps ne montrerait " +
          'donc rien.',
      );
    }
    if (moment === 'apres' && rayees !== 3) {
      throw new Error(
        `à ${jours} jours, ${4 - rayees} transition(s) sur 4 sont ouvertes au lieu d'une ` +
          "seule : l'image ne montre plus « une transition s'est ouverte ».",
      );
    }

    mesures[moment] = { jours, clip: await cadre(page, HAUT, BAS, 16, 14) };
  }

  // Le cadre partagé : même x, même y, même largeur, même hauteur.
  const { avant, apres } = mesures;
  if (Math.abs(avant.clip.y - apres.clip.y) > 1) {
    throw new Error(
      `le couple horloge + graphe ne commence pas au même endroit sur les deux pages ` +
        `(y=${avant.clip.y} à ${AVANT} jours, y=${apres.clip.y} à ${APRES}) : un cadre commun ` +
        'serait un faux. Ce qui précède la section a changé de hauteur.',
    );
  }
  const commun = {
    x: BANDE.x,
    y: Math.min(avant.clip.y, apres.clip.y),
    width: BANDE.largeur,
    height: Math.max(avant.clip.height, apres.clip.height),
  };
  if (MESURES) {
    console.log(
      `  le moment : cadre commun ${commun.width}×${commun.height} à y=${commun.y} ` +
        `(utile ${avant.clip.height} à ${AVANT} j, ${apres.clip.height} à ${APRES} j)`,
    );
  }

  for (const [moment, nom] of [['avant', 'tasswiya-avant'], ['apres', 'tasswiya-apres']]) {
    await ouvrir(page, `/tutoriel?jours=${mesures[moment].jours}`);
    await photographier(page, nom, commun);
  }
}

/* ══ Les trois autres écrans ══════════════════════════════════════════════ */

const ECRANS = [
  {
    /* tasswiya.jpg — LA COUVERTURE : LE COMPTEUR ET LES CINQ HORLOGES.
     *
     * CE QU'ELLE DOIT MONTRER : qu'il y a PLUSIEURS délais sur un même dossier
     * et qu'ils NE PARTENT PAS DU MÊME ÉVÉNEMENT. Le grand compteur donne le
     * délai de régularisation pénale — celui dont tout le projet parle —, et le
     * tableau juste en dessous donne les cinq horloges avec, en DEUXIÈME
     * COLONNE, le fait daté dont chacune part : l'écédar pour H3, l'injonction
     * bancaire pour H2, l'incident de paiement pour H5… Cette colonne est la
     * raison d'être de l'image : un écran qui afficherait « délai : 3 jours »
     * sans elle reproduirait l'erreur de la presse en la rendant crédible.
     *
     * Les écarts se lisent sans légende sur ce dossier : une horloge échue
     * depuis des semaines, une à quelques jours, une à plusieurs années.
     *
     * ELLE EST EN HAUTEUR, ET C'EST UN PROBLÈME POUR LA CARTE DU PORTFOLIO.
     * Le contenu demande environ 1 620 px de haut dans une colonne de 896 px :
     * il n'existe aucun cadrage à la fois paysage et honnête, parce que la
     * colonne « Part de » est faite de phrases et non de mots, et c'est elle
     * l'argument. Or `src/components/Projects.tsx` affiche l'image de
     * couverture en `aspect-video object-cover` : une image en hauteur y sera
     * rognée au centre, et le compteur — le haut de l'image — disparaîtra. Il
     * faut donc trancher DANS LA FICHE, pas ici : soit la carte accepte une
     * couverture en hauteur, soit la fiche prend pour couverture l'une des
     * images paysage de ce lot (`tasswiya-avant` fait 920 × 831).
     * SI ELLE CESSE D'ÊTRE JUSTE : le script exige cinq horloges et un
     * compteur non absent. Si le jeu de données fictif est reconstruit et que
     * CH-2026-0107 n'a plus cinq horloges, il faut changer de dossier
     * (TASSWIYA_DOSSIER) et non élargir la promesse.
     */
    nom: 'tasswiya',
    chemin: `/dossiers/${DOSSIER}`,
    async preparer(page) {
      const absent = await page.$('.compteur--absent');
      if (absent) {
        throw new Error(
          `le dossier ${DOSSIER} n'a aucun délai de régularisation pénale en cours : ` +
            "le compteur affiche l'absence d'échéance, ce qui est une autre image que " +
            'celle promise.',
        );
      }
      const horloges = await compter(page, '.horloges tbody tr:not(.horloges__effet)');
      if (horloges !== 5) {
        throw new Error(
          `le dossier ${DOSSIER} porte ${horloges} horloge(s) en cours et non 5 : ` +
            "l'image s'appelle « les cinq horloges » et n'en montrerait pas cinq.",
        );
      }
    },
    // Du compteur au bas du tableau. Marge haute courte : au-dessus du
    // compteur il y a les pastilles d'état, et une marge large en ferait
    // entrer une tranche coupée en deux.
    cadre: (page) => cadre(page, '.compteur', '.horloges', 14, 16),
  },

  {
    /* tasswiya-degres.jpg — LES QUATRE DEGRÉS DE CERTITUDE.
     *
     * CE QU'ELLE DOIT MONTRER : la pièce la plus originale de la charte. Le
     * degré de certitude d'une règle — établi, probable, incertain, choix de ce
     * logiciel — n'est PAS porté par une couleur. Les quatre rôles chromatiques
     * du produit sont déjà pris (indigo = action, or = valeur, vert et rouge =
     * direction), et « incertain » devrait alerter donc tirer vers le rouge,
     * qui appartient à « délai expiré » : un rouge qui voudrait dire deux
     * choses ne dirait plus rien.
     *
     * Le degré est donc porté par LE TRAIT — plein, double, tireté, pointillé
     * —, par la trame de fond, par le retrait et par l'étiquette en mots.
     *
     * POURQUOI LA PLANCHE DE CONTRÔLE ET PAS UN ÉCRAN DU PRODUIT : la planche
     * présente les quatre degrés CÔTE À CÔTE, et la colonne de droite est la
     * même chose passée en niveaux de gris. C'est l'épreuve, pas l'illustration
     * : si les quatre se distinguent encore sans aucune couleur, la décision
     * tient. Aucun écran du produit ne met les quatre ensemble — ils y
     * apparaissent là où ils s'appliquent, un à la fois.
     *
     * La planche ne charge que `tasswiya.css` et n'a ni contrôleur ni donnée :
     * elle reste vraie quand le domaine casse.
     */
    nom: 'tasswiya-degres',
    chemin: '/charte/planche.html',
    async preparer(page) {
      const degres = ['etabli', 'probable', 'incertain', 'choix-produit'];
      const manquants = [];
      for (const d of degres) {
        if (!(await page.$(`.planche-duo .regle--${d}`))) manquants.push(d);
      }
      if (manquants.length) {
        throw new Error(
          `la planche ne présente plus les degrés ${manquants.join(', ')} : ` +
            "l'image promet quatre traits côte à côte.",
        );
      }
    },
    // Du titre de la section à la fin des deux colonnes. Le titre fait partie
    // de l'image : sans lui, un lecteur voit huit encadrés et ne sait pas que
    // la colonne de droite est la même chose sans couleur.
    cadre: (page) =>
      cadre(page, { selecteur: 'h2', contient: 'Le cinquième rôle' }, '.planche-duo', 10, 12),
  },

  {
    /* tasswiya-regle.jpg — UNE RÈGLE AVEC SA SOURCE, ET SON DOUBLE PRODUIT.
     *
     * CE QU'ELLE DOIT MONTRER : que le droit a été lu avant d'être codé, et
     * qu'il a DÉMENTI le cahier des charges. L'article 325 al. 8 ouvre la
     * prorogation « لمدة مماثلة أو أكثر » — pour une durée égale ou supérieure
     * — sans plafonner le nombre de prorogations. Les mots « une seule fois »
     * n'y figurent pas, et la valeur de 60 jours qu'on lit dans la presse n'est
     * écrite nulle part.
     *
     * L'image cadre DEUX encadrés, dans l'ordre où le produit les affiche :
     *
     *   • « Ce que la loi ouvre » — trait plein, degré ÉTABLI, l'énoncé,
     *     l'article, le verbatim arabe (seule la version arabe du Bulletin
     *     officiel fait foi) et le renvoi au dossier de règles, LOI.md § 4.1 ;
     *   • « Ce que ce logiciel autorise, et qui n'est pas la même chose » —
     *     trait pointillé, degré CHOIX DE CE LOGICIEL : le quota d'une
     *     prorogation est un paramètre de Tasswiya, et l'encadré le dit LÀ OÙ
     *     IL BLOQUE. Son attribution donne même la vérification par absence,
     *     reproductible : un `grep -c` du mot « une seule fois » dans le texte
     *     de la loi et dans la circulaire, qui renvoie zéro dans les deux cas.
     *
     * L'ORDRE DES DEUX ENCADRÉS EST LA DÉMONSTRATION. Si le quota venait en
     * premier, un lecteur pressé lirait « la loi limite à une prorogation »,
     * qui est exactement la phrase à ne jamais écrire. Le script vérifie donc
     * que la règle de droit précède le choix produit, et refuse d'écrire
     * l'image si l'ordre s'inverse.
     */
    nom: 'tasswiya-regle',
    chemin: `/dossiers/${DOSSIER}`,
    async preparer(page) {
      const ordre = await page.$$eval('.regle', (regles) => {
        const loi = regles.findIndex((r) => r.textContent.includes('Ce que la loi ouvre'));
        const choix = regles.findIndex((r) =>
          r.textContent.includes("Ce que ce logiciel autorise"),
        );
        return { loi, choix };
      });
      if (ordre.loi < 0 || ordre.choix < 0) {
        throw new Error(
          "l'un des deux encadrés de la prorogation est absent de l'écran du dossier " +
            `(loi : ${ordre.loi}, choix produit : ${ordre.choix}).`,
        );
      }
      if (ordre.loi > ordre.choix) {
        throw new Error(
          'le choix produit est affiché AVANT la règle de droit : cadré ainsi, ' +
            "l'image laisserait lire « la loi limite à une prorogation », qui est faux.",
        );
      }
      // Le verbatim arabe et le renvoi à LOI.md sont la moitié de ce que
      // l'image promet : sans eux elle montre deux encadrés, pas une source.
      const complet = await page.$$eval('.regle', (regles) => {
        const r = regles.find((e) => e.textContent.includes('Ce que la loi ouvre'));
        return !!(r && r.querySelector('.arabe') && r.querySelector('.renvoi'));
      });
      if (!complet) {
        throw new Error(
          "la règle « Ce que la loi ouvre » n'affiche plus son verbatim arabe ou son " +
            "renvoi à LOI.md : l'image ne prouverait plus que le texte a été lu.",
        );
      }
      await page.evaluate(() => {
        const r = Array.from(document.querySelectorAll('.regle')).find((e) =>
          e.textContent.includes('Ce que la loi ouvre'),
        );
        r.scrollIntoView({ block: 'center', behavior: 'instant' });
      });
      await attendreStabilite(page);
    },
    // Marges courtes des deux côtés : le tableau de la prorogation est juste
    // au-dessus et le titre des prorogations du dossier juste en dessous.
    cadre: (page) =>
      cadre(
        page,
        { selecteur: '.regle', contient: 'Ce que la loi ouvre' },
        { selecteur: '.regle', contient: "Ce que ce logiciel autorise" },
        10,
        10,
      ),
  },
];

/* ══ Exécution ════════════════════════════════════════════════════════════ */

// Un échec par image, et non un échec global : mieux vaut quatre images justes
// et un message qui dit laquelle manque, qu'une cinquième image décorative qui
// ne démontre rien.
const echecs = [];

const navigateur = await puppeteer.launch({
  executablePath: CHEMIN_CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

try {
  const page = await navigateur.newPage();
  await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 2 });
  await page.emulateMediaFeatures([
    // Voir `attendreStabilite` : `tasswiya.css` honore déjà ce mode.
    { name: 'prefers-reduced-motion', value: 'reduce' },
    // Tasswiya sert un thème sombre à qui en demande un (`tasswiya.css`,
    // bloc 1). On fixe le clair, qui est le thème « papier » du produit et
    // celui des écrans décrits dans la fiche projet : sans cela, la capture
    // dépendrait du réglage de la machine qui la lance.
    { name: 'prefers-color-scheme', value: 'light' },
  ]);

  try {
    await photographierLeMoment(page);
  } catch (echec) {
    echecs.push(`tasswiya-avant.jpg et tasswiya-apres.jpg : ${echec.message}`);
    console.error(`  ÉCHEC le moment (avant/après) — ${echec.message}`);
  }

  for (const ecran of ECRANS) {
    try {
      await ouvrir(page, ecran.chemin);
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
