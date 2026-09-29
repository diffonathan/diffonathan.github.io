/**
 * Carrousel — « Qui a le droit de changer quoi ? »
 *
 * Pilier : les processus métier qui vivent dans un fichier partagé.
 * Cible : un directeur d'exploitation dont le planning est modifié à trois mains.
 *
 * La scène (société de transport, planning des chauffeurs) est un exemple typé,
 * pas un dossier réel : aucun client n'y est désigné.
 *
 * Génération : node scripts/gen-carrousel.mjs planning-partage
 */
export default {
  fichier: 'planning-partage',
  diapos: [
    {
      titre: 'Trois personnes modifient<br>le même planning<br><span class="or">en même temps.</span>',
      sous: 'Vous croyez que le problème, c’est le fichier. J’ai mis longtemps à comprendre que non.',
    },
    {
      surtitre: 'Le problème',
      titre: 'Une ligne a bougé,<br>personne ne sait qui.',
      corps:
        'Vous appelez, on vous répond « j’ai corrigé une erreur ». Vous corrigez la correction. ' +
        '<span class="fort">Un chauffeur part sur la mauvaise tournée.</span>',
    },
    {
      surtitre: 'Deux semaines plus tard',
      titre: 'La règle a tenu,<br>puis elle a cédé.',
      corps:
        '« Personne ne touche au fichier sauf moi. » Puis une modification un samedi, vous n’êtes pas là, ' +
        'et une copie « provisoire » s’ouvre — elle ne l’est jamais.<br><br>' +
        '<span class="fort">Personne n’a mal fait son travail :</span> un tableur n’a jamais été prévu ' +
        'pour qu’on soit trois dessus.',
    },
    {
      surtitre: 'La vraie question',
      titre: 'Qui a le droit<br>de changer quoi ?',
      corps:
        'Ce que je remplace en premier, ce n’est pas le tableur. ' +
        '<span class="fort">C’est cette question-là.</span>',
    },
    {
      surtitre: 'Ce que ça change',
      titre: 'Une seule version,<br>et chaque ligne<br>a un propriétaire.',
      corps:
        'Chaque modification est datée et signée. Le tableur revient en export, pour ceux qui en ont besoin : ' +
        '<span class="fort">il n’est plus la référence, il en est la photo.</span><br><br>' +
        'Ça se paie : verrouiller qui modifie quoi enlève de la souplesse, et il faut prévoir les cas ' +
        'd’urgence au lieu de les improviser.',
    },
    {
      offre: true,
      titre: 'Un fichier partagé décide<br>de qui travaille où ?',
      corps: 'Je prends des processus qui vivent dans des fichiers et j’en fais des applications que l’équipe ouvre tous les jours.',
      metier: 'Chaque ligne appartient à quelqu’un, chaque modification est signée.',
      appel: 'Écrivez-moi : je vous dirai si ça mérite une application, ou juste une règle claire.',
    },
  ],
};
