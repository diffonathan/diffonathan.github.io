/**
 * Carrousel — « Le cahier des charges que vous ne pouvez pas écrire »
 *
 * Lundi 28 septembre 2026, 08h00. Pilier : le recueil du besoin.
 * Cible : quelqu'un qui a un projet mais se tait, parce qu'on lui demande un
 * document qu'il ne sait pas rédiger.
 *
 * ── Pourquoi le coût vit ICI et pas dans le post ────────────────────────────
 * La règle de rédaction interdit de répéter l'étiquette « ce que ça coûte »
 * plus d'une fois par jour : employée trois fois, le lecteur voit le gabarit
 * avant de voir le contenu. Le coût est donc porté par la diapo 5, et le texte
 * du post ne le reprend pas.
 *
 * Aucune scène identifiable : le fichier à onglets et à colonnes ajoutées à la
 * main est une évidence du métier, pas le dossier de quelqu'un.
 *
 * Génération : node scripts/gen-carrousel.mjs cahier-charges-fin
 */
export default {
  fichier: 'cahier-charges-fin',
  diapos: [
    {
      titre: 'Le cahier des charges<br>que vous ne pouvez<br><span class="or">pas écrire.</span>',
      sous: 'On vous le demande avant d’accepter de vous écouter. C’est l’inverse de l’ordre normal, et ça fait taire beaucoup de monde.',
    },
    {
      surtitre: 'Le problème',
      titre: 'Un besoin ne vit pas<br>dans une tête.',
      corps:
        'Il vit dans un fichier : celui que l’équipe ouvre chaque matin, avec ses onglets, ses colonnes ajoutées à la main, ' +
        'et ses lignes en couleur qu’<span class="fort">une seule personne sait lire</span>.<br><br>' +
        'Une façon de travailler s’observe. Elle ne se récite pas de mémoire.',
    },
    {
      surtitre: 'Ce qui arrive alors',
      titre: 'Faute de le décrire,<br>on copie ailleurs.',
      corps:
        'On décrit l’outil dont on a entendu parler chez un confrère. On obtient un outil taillé pour le métier de quelqu’un d’autre.<br><br>' +
        '<span class="fort">Il est livré, il fonctionne, et personne ne l’ouvre.</span>',
    },
    {
      surtitre: 'L’ordre inverse',
      titre: 'Le cahier des charges<br>s’écrit à la fin.',
      corps:
        'Il est le compte rendu de ce qu’on a compris ensemble, jamais le ticket d’entrée. ' +
        'On part de ce qui existe déjà : le fichier, les contournements, l’export que quelqu’un refait chaque semaine à la main.',
    },
    {
      surtitre: 'Ce que ça demande',
      titre: 'Montrer le fichier<br>qu’on n’ose pas<br><span class="or">envoyer.</span>',
      corps:
        'Ouvrir un fichier imparfait devant quelqu’un qu’on connaît depuis vingt minutes, puis lire noir sur blanc une façon ' +
        'de travailler qu’on n’avait jamais écrite.<br><br>' +
        'Ce n’est confortable ni d’un côté ni de l’autre de la table.',
    },
    {
      offre: true,
      titre: 'Ouvrez le fichier<br>avant le document.',
      corps: 'Commencez par ce que votre équipe ouvre déjà chaque matin. Le document viendra après, et il sera juste.',
      metier: 'Je transforme un processus qui vit dans des fichiers en une application que l’équipe ouvre tous les jours.',
      appel: 'Montrez-moi celui que vous n’oseriez envoyer à personne : c’est par là qu’il faut commencer.',
    },
  ],
};
