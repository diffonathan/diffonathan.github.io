/**
 * Carrousel — « Tout le monde demande combien coûte un site. »
 *
 * Pilier : le web sur-mesure et l'acquisition.
 *
 * Les trois montants (2 400, 6 000, 14 000 €) sont une scène hypothétique,
 * pas des devis réels : ils illustrent un écart de prix que tout dirigeant a
 * déjà eu sous les yeux. Aucun client, aucun projet n'y est désigné.
 *
 * Génération : node scripts/gen-carrousel.mjs devis-site
 */
export default {
  fichier: 'devis-site',
  diapos: [
    {
      titre: 'Tout le monde demande<br>combien coûte<br><span class="or">un site.</span>',
      sous: 'Presque personne ne pose la question qui décide de ce que ça donnera six mois après.',
    },
    {
      surtitre: 'Le problème',
      titre: 'Trois devis.<br>Aucune différence visible.',
      corps:
        '2 400 €, 6 000 €, 14 000 €. Les trois promettent un site responsive, un référencement optimisé et une formation. ' +
        '<span class="fort">Vous cherchez ce qui les sépare, et vous ne le trouvez pas.</span>',
    },
    {
      surtitre: 'Quatre mois plus tard',
      titre: 'Vous voulez changer<br>trois lignes.',
      corps:
        'Vous rouvrez le mail du prestataire, qui répond moins vite qu’avant. ' +
        '<span class="fort">Aucun des trois devis ne parlait de ce moment-là.</span><br><br>' +
        'Vous ne pouviez pas le prévoir.',
    },
    {
      surtitre: 'La question à poser',
      titre: 'Qui touchera ce site<br>dans six mois ?',
      corps:
        'Et avec quoi. <span class="fort">C’est la ligne qui décide si votre site vit ou se fige</span> — ' +
        'pas un détail de contrat.',
    },
    {
      surtitre: 'Les deux bonnes réponses',
      titre: 'Vous, ou<br>un prix écrit.',
      corps:
        '<span class="fort">Si c’est vous :</span> un outil que vous ouvrez seul, des pages éditables, rien de figé dans le code.<br><br>' +
        '<span class="fort">Si c’est le prestataire :</span> le devis dit ce que coûte une modification, et sous quel délai.',
    },
    {
      offre: true,
      titre: 'Des devis que vous<br>n’arrivez pas à départager ?',
      corps: 'Je construis des sites vitrine, des boutiques et des tunnels de vente, de bout en bout.',
      metier: 'Des pages que vous modifiez vous-même, sans attendre personne.',
      appel: 'Écrivez-moi : je vous dirai lequel tient la route — même si ce n’est pas le mien.',
    },
  ],
};
