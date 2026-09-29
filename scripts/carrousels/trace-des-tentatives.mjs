/**
 * Carrousel — « Vous l'avez fait. Mais sauriez-vous le prouver ? »
 *
 * Pilier : les documents qui circulent dans un processus, et ce qu'il en reste.
 * Angle : le constat qui dérange — vos outils n'enregistrent que vos réussites.
 *
 * ── La porte d'entrée : une actualité, deux citations, rien de plus ─────────
 * Source primaire, ouverte et vérifiée par trois lectures indépendantes :
 * DGFiP, « Facturation électronique : guide pratique de démarrage au
 * 1er septembre 2026 », daté de juillet 2026, 29 questions-réponses.
 *
 * Ce qui est cité ici est confirmé mot à mot :
 *   - avant-propos, p. 2 : l'administration « tiendra compte des difficultés
 *     réelles, documentées et suivies d'actions de correction » ;
 *   - question n° 16, p. 20 : « Quels éléments dois-je conserver pour
 *     démontrer que j'ai tenté d'émettre correctement mes factures
 *     électroniques ? »
 *
 * ── Les pièges de ce sujet, relevés dans le guide et volontairement évités ──
 * - NE JAMAIS écrire « pas de sanctions ». Le guide répond « Non » à leur
 *   automaticité, pas à leur existence : elles « ne seront pas appliquées de
 *   manière immédiate, automatique et aveugle », et il rappelle l'amende par
 *   facture de l'article 1737 du CGI. Il écrit deux fois que son approche
 *   « ne constitue ni un report ni une suspension de l'obligation ».
 * - Au 1er septembre 2026, l'obligation généralisée est de RECEVOIR. L'émission
 *   ne vise à cette date que les grandes entreprises et les ETI ; pour les PME,
 *   TPE et micro-entreprises, elle s'applique au 1er septembre 2027. Le
 *   carrousel s'en tient donc à la réception, vraie pour tout le monde.
 * - Le guide dit « plateforme agréée » et jamais « PDP » : employer le sigle
 *   trahirait une source plus ancienne que celle qu'on affiche.
 * - Il emploie aussi « trajectoire ACTIVE de mise en conformité » ailleurs :
 *   on ne cite donc que le passage dont on est sûr, et on ne colle pas
 *   l'adjectif « sérieuse » à une question qui porte l'autre.
 * - Aucune durée n'est donnée à la « phase de démarrage » : ne jamais écrire
 *   « six mois de tolérance ».
 *
 * Aucun client, aucun dossier, aucun outil réel n'est désigné : la scène du
 * document refusé puis renvoyé est une mécanique de métier, pas un cas vécu.
 *
 * Génération : node scripts/gen-carrousel.mjs trace-des-tentatives
 */
export default {
  fichier: 'trace-des-tentatives',
  diapos: [
    {
      // Pas de surtitre : la couverture doit happer, pas s'annoncer. Et le
      // « sous » MONTRE ce qui manque au lieu de promettre une révélation.
      titre: 'Vous l’avez fait.<br>Mais sauriez-vous<br><span class="or">le prouver ?</span>',
      sous: 'Entre ces deux phrases, il y a tout ce que vos outils n’écrivent pas : les rejets, les reprises, les tentatives.',
    },
    {
      surtitre: 'Facture électronique, 1er septembre',
      titre: 'Il ne suffit pas<br>d’avoir <span class="or">essayé</span>.',
      // Le corps reste court : cette diapo porte déjà un encart.
      corps:
        'Les entreprises concernées doivent pouvoir recevoir leurs factures par une plateforme agréée. ' +
        'L’administration tiendra compte des <span class="fort">difficultés « réelles, documentées et suivies d’actions de correction »</span>.',
      encart: {
        titre: 'Ce que le guide demande de garder',
        valeur: 'Question n° 16 sur 29',
        source:
          '« Quels éléments dois-je conserver pour démontrer que j’ai tenté d’émettre correctement mes factures électroniques ? »',
        page: 'Guide pratique de démarrage · DGFiP · juillet 2026',
      },
    },
    {
      // Le pont hors de la fiscalité se fait ICI, dans le carrousel — pas
      // seulement dans le texte du post. C'est la diapo qui décide du défilement :
      // un lecteur qui n'émet pas de factures doit s'y reconnaître quand même.
      surtitre: 'Chez vous, sans réforme',
      titre: 'Vos outils gardent<br>vos réussites.<br><span class="or">Rien d’autre.</span>',
      corps:
        'Un document parti laisse une trace. Un document refusé, renvoyé, repris à la main : personne ne le consigne, ' +
        'parce que c’est le moment précis où tout le monde est occupé à réparer.<br><br>' +
        'Ce qu’on ne garde jamais, ce ne sont pas les succès. <span class="fort">Ce sont les tentatives.</span>',
    },
    {
      // L'agitation NOMME le coût dur — le doublon — au lieu de le ranger dans
      // la solution, où il n'agiterait plus personne.
      surtitre: 'Le jour où on demande',
      titre: 'Quelqu’un demande<br>ce qui s’est passé.',
      corps:
        'Un client, un contrôle, un expert-comptable : qui a fait quoi, et quand ? ' +
        'Il faut rouvrir des mails, redemander à ceux qui étaient là, recouper deux versions.<br><br>' +
        'Et comme personne ne sait si la pièce est déjà passée, elle repart une deuxième fois. ' +
        '<span class="fort">Deux enregistrements, deux paiements.</span>',
    },
    {
      // La contrepartie est celle du LECTEUR — ce qu'il donne — et non celle de
      // Nathan (« on construit plus lentement »), qui ne lui coûte rien.
      surtitre: 'Ce qu’on change',
      titre: 'Chaque étape écrit<br>ce qui lui arrive.',
      corps:
        'Y compris quand elle échoue. Le processus sait alors qu’une pièce est déjà passée, et ne la repasse pas.<br><br>' +
        'Sa contrepartie, c’est vous qui la payez : quelques secondes de plus à chaque étape, et un journal d’échecs ' +
        'que personne n’aime voir écrit — <span class="fort">sauf le jour où tout le monde en a besoin.</span>',
    },
    {
      offre: true,
      titre: 'S’il rate demain,<br>qu’en restera-t-il ?',
      corps: 'Prenez le processus le plus important de la maison et posez la question. Si la réponse tient dans un fil de mails, elle ne tiendra pas six mois.',
      metier: 'Je prends un processus qui vit dans des fichiers et j’en fais une application où chaque étape laisse une trace.',
      appel: 'La dernière fois qu’un envoi a échoué chez vous : où est-ce écrit ? Si c’est « nulle part », écrivez-moi.',
    },
  ],
};
