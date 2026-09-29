/**
 * Carrousel — « Une IA vous annonce une date. Vous la croyez ? »
 *
 * Pilier : l'IA appliquée, sans mystique. Publié en premier.
 *
 * Génération : node scripts/gen-carrousel.mjs extraction-verifiable
 */
export default {
  fichier: 'extraction-verifiable',
  diapos: [
    {
      // Pas de sur-titre : la première diapo doit happer, pas s'annoncer.
      titre: 'Une IA vous annonce :<br>« date limite :<br><span class="or">28 septembre</span> ».<br>Vous la croyez ?',
      sous: 'La question qui décide si un outil d’extraction sert vraiment à quelque chose.',
    },
    {
      surtitre: 'Le problème',
      titre: 'Répondre à un appel d’offres,<br>c’est lire des centaines<br>de pages.',
      corps:
        'Pour en tirer trois informations : la date limite, le périmètre, les pièces à fournir. ' +
        'Dans la plupart des équipes, quelqu’un le fait encore à la main.',
    },
    {
      surtitre: 'Ce que ça coûte vraiment',
      titre: 'Ce n’est pas<br>le temps perdu.',
      corps:
        'C’est le jour où l’information est ratée. L’offre part sans une pièce obligatoire, ou arrive après l’heure. ' +
        '<span class="fort">Des semaines de travail ne comptent plus.</span><br><br>' +
        'Personne n’a mal fait son travail. Le dossier était simplement trop gros pour un œil humain un vendredi soir.',
    },
    {
      surtitre: 'Ce que je construis',
      titre: 'Automatiser cette lecture<br>est la partie facile.',
      corps:
        'Lire des PDF, même scannés, et en sortir une date : la technique existe et fonctionne. ' +
        '<span class="fort">La difficulté n’est pas là.</span><br><br>' +
        'Elle est dans ce qu’on fait de la réponse. Une machine qui affirme sans montrer déplace le risque au lieu de l’enlever.',
    },
    {
      surtitre: 'Le point qui change tout',
      titre: 'Montrer<br>le passage source.',
      corps: 'À côté de chaque information extraite, la phrase exacte d’où elle vient.',
      encart: {
        titre: 'Exemple — ce que voit l’opérateur',
        valeur: '28 septembre 2025 — 12 h 00',
        source: '« Les offres devront parvenir au plus tard le 28/09/2025 à 12 h 00, cachet faisant foi. »',
        page: 'Exemple d’illustration · page 14',
      },
    },
    {
      offre: true,
      titre: 'Un processus qui<br>ressemble au vôtre ?',
      corps: 'Beaucoup de documents, beaucoup de vérifications à la main, et une erreur qui coûte cher.',
      metier:
        'Je prends un processus qui vit dans des fichiers Excel et des modèles Word, et j’en fais une application que l’équipe utilise tous les jours. Seul, de bout en bout.',
      appel: 'Écrivez-moi. Je vous dirai honnêtement si c’est automatisable — ou si ça n’en vaut pas la peine.',
    },
  ],
};
