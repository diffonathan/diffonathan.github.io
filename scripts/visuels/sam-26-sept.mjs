/**
 * Visuels du samedi 26 septembre 2026 — trois images pour trois créneaux.
 *
 * ── Ce qui a été corrigé après relecture ────────────────────────────────────
 * Le brouillon faisait dire au panneau « après » que personne n'avait demandé
 * d'aide le lundi de la bascule. C'est une scène inventée : la matière dit
 * seulement que l'équipe a basculé sans changer ses habitudes, que le suivi
 * reprend les colonnes exactes de l'ancien tableur et qu'il s'exporte au même
 * format. Les trois points « après » s'en tiennent donc à cela.
 *
 * Deuxième correction : aucune phrase de ces visuels ne figure dans les posts
 * qu'ils accompagnent. Un visuel qui recopie son texte fait lire deux fois la
 * même chose et désamorce la question finale.
 *
 * Génération : node scripts/gen-visuel.mjs sam-26-sept
 *   01 → post de 08h00   02 → post de 12h00   03 → post de 19h00
 */
export default {
  fichier: 'sam-26-sept',
  visuels: [
    {
      // 08h00 — la pièce de fond. Le post porte l'arbitrage ; le visuel montre
      // le résultat, que le texte ne décrit plus.
      gabarit: 'avantApres',
      surtitre: 'Le lundi de la bascule',
      titre: 'Remplacer un fichier <span class="or">qui tourne</span>',
      avant_titre: 'La semaine<br>d’avant',
      avant_points: [
        'Chacun sa copie, aucune ne fait foi',
        'Retrouver qui a modifié quoi prend du temps',
        'Une information clé dort dans une case masquée',
      ],
      apres_titre: 'La semaine<br>d’après',
      apres_points: [
        'Les mêmes colonnes, dans le même ordre',
        'Les mêmes exports, au même format',
        'Une seule version, et elle est à jour',
      ],
    },
    {
      // 12h00 — les deux relecteurs ont signalé qu'un samedi midi, un bloc de
      // texte sans image se dépasse en défilant. La citation ne reprend pas la
      // formule du post (« si les données ne sortent pas, l'outil ne part
      // pas ») : elle dit ce que le post laisse implicite.
      gabarit: 'citation',
      phrase: 'Un outil qu’on ne peut<br>pas quitter n’a jamais<br>vraiment été <span class="or">choisi.</span>',
      apres_phrase: 'La question à poser avant de signer : comment je récupère tout, le jour où j’arrête ?',
    },
    {
      // 19h00 — interface entièrement inventée. Le surtitre le dit, et le
      // premier commentaire du post le répète : on ne montre jamais l'écran
      // d'un outil qui appartient à quelqu'un d'autre.
      gabarit: 'ecran',
      surtitre: 'Maquette — interface fictive',
      titre: 'L’écran nomme l’état<br><span class="or">au lieu de le colorier</span>',
      cartes: [
        { k: 'Dossiers ouverts', v: '24' },
        { k: 'De votre côté', v: '3' },
        { k: 'Sans réponse', v: '7' },
      ],
      rangs: [
        { pct: 34, etat: 'À vous' },
        { pct: 26, etat: 'Chez eux' },
        { pct: 18, etat: 'À relire' },
        { pct: 14, etat: 'Terminé' },
        { pct: 8, etat: 'Arrêté' },
      ],
    },
  ],
};
