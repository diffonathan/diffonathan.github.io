/**
 * Planche d'essai — les sept gabarits, avec du contenu réel.
 *
 * Elle sert à juger les compositions côte à côte avant de les utiliser en
 * production. Chaque visuel s'adresse à la cible réelle : quelqu'un qui veut
 * faire construire un site, un SaaS, une application métier ou mobile, ou
 * digitaliser un processus — pas un recruteur.
 *
 * Génération : node scripts/gen-visuel.mjs planche-gabarits
 */
export default {
  fichier: 'planche-gabarits',
  visuels: [
    {
      gabarit: 'citation',
      phrase: 'Le plus dur n’est pas<br>de livrer l’application.<br>C’est qu’on l’ouvre<br><span class="or">encore six mois après.</span>',
      apres: 'Un outil que l’équipe abandonne coûte plus cher que celui qu’on n’a jamais construit.',
    },
    {
      gabarit: 'chiffre',
      nombre: '8',
      unite: 'applications et sites en ligne',
      contexte:
        'Conçus, développés et mis en service. De l’interface au serveur, ' +
        '<span class="fort">paiement et hébergement compris</span>. Chacun est utilisé par ' +
        'quelqu’un d’autre que moi.',
    },
    {
      gabarit: 'avantApres',
      surtitre: 'Digitaliser un processus',
      titre: 'Ce qui change, concrètement',
      avant: {
        etiquette: 'Le fichier',
        titre: 'Le processus vit<br>dans des fichiers',
        points: [
          'Trois versions du même tableur circulent',
          'Personne ne sait qui a modifié quoi',
          'Les documents sont recopiés à la main',
        ],
      },
      apres: {
        etiquette: 'L’outil',
        titre: 'Le processus vit<br>dans une application',
        points: [
          'Une seule version, pour tout le monde',
          'Chaque modification est datée et signée',
          'Les documents sortent de vos modèles',
        ],
      },
    },
    {
      gabarit: 'etapes',
      surtitre: 'Comment je travaille',
      titre: 'De l’idée à la mise en ligne',
      sous: 'Quatre temps, et vous voyez quelque chose de réel dès le deuxième.',
      etapes: [
        {
          titre: 'Comprendre le processus tel qu’il est',
          texte: 'Pas tel qu’il devrait être. On part de vos fichiers et de vos habitudes réelles.',
        },
        {
          titre: 'Livrer une première version utilisable',
          texte: 'Étroite mais complète : une personne peut déjà s’en servir pour de vrai.',
        },
        {
          titre: 'La faire adopter',
          texte: 'On reprend vos colonnes, vos mots, vos exports. Le changement doit être invisible.',
        },
        {
          titre: 'La faire vivre',
          texte: 'Vous modifiez ce qui bouge souvent, sans m’attendre. Le reste, on le prévoit.',
        },
      ],
    },
    {
      gabarit: 'liste',
      surtitre: 'À garder sous la main',
      titre: '5 questions avant<br>de faire développer',
      points: [
        { titre: 'Qui l’ouvrira tous les matins ?', texte: 'Si la réponse est « personne en particulier », le projet n’est pas mûr.' },
        { titre: 'Que se passe-t-il quand ça casse ?', texte: 'Un outil sans réponse à cette question s’arrête au premier incident.' },
        { titre: 'Qui pourra le modifier dans six mois ?', texte: 'Vous, ou un prestataire dont le prix est écrit. Pas de troisième réponse.' },
        { titre: 'Où vivent les données ?', texte: 'Chez qui, dans quel pays, et comment les récupérer si vous partez.' },
        { titre: 'Combien coûte un changement ?', texte: 'Le chiffre qui compte n’est pas le devis, c’est celui de la modification.' },
      ],
    },
    {
      gabarit: 'comparatif',
      surtitre: 'La question qu’on me pose le plus',
      titre: 'Logiciel du marché<br>ou sur mesure ?',
      colonnes: ['Logiciel du marché', 'Sur mesure'],
      lignes: [
        ['Disponible tout de suite', 'Quelques semaines avant la V1'],
        ['Vous adaptez vos habitudes au logiciel', 'L’outil épouse votre façon de travailler'],
        ['Abonnement par personne, qui monte', 'Un coût de construction, puis l’hébergement'],
        ['Vous attendez que l’éditeur décide', 'Vous décidez de ce qui change'],
        ['Le bon choix si votre métier est standard', 'Le bon choix si c’est lui qui vous distingue'],
      ],
    },
    {
      gabarit: 'ecran',
      surtitre: 'Exemple d’illustration',
      titre: 'Ce qu’une équipe voit<br>le lundi matin',
      url: 'votre outil · tableau de bord',
      nav: [1, 2, 3, 4, 5, 6],
      navActif: 1,
      cartes: [
        { k: 'En cours', v: '12' },
        { k: 'À valider', v: '3' },
        { k: 'En retard', v: '1' },
      ],
      rangs: [
        { pct: 82, etat: 'Prêt' },
        { pct: 55, etat: 'En cours' },
        { pct: 38, etat: 'En attente' },
        { pct: 94, etat: 'Validé' },
        { pct: 20, etat: 'Bloqué' },
      ],
    },
  ],
};
