/**
 * Visuel du lundi 28 septembre 2026 — post de 19h00.
 *
 * ── Ce qui a été corrigé ────────────────────────────────────────────────────
 * La version produite par la chaîne reprenait mot pour mot les deux premières
 * phrases du post (« Ne me montrez pas le fichier propre »). Un visuel qui
 * recopie son texte fait lire deux fois la même chose et désamorce la question
 * finale.
 *
 * Les deux phrases portées ici ont donc été RETIRÉES du post : le texte raconte
 * la décision et ce qu'elle coûte, l'image porte la formule à retenir. Elles ne
 * se répètent nulle part.
 *
 * Génération : node scripts/gen-visuel.mjs lun-28-sept
 */
export default {
  fichier: 'lun-28-sept',
  visuels: [
    {
      gabarit: 'citation',
      phrase:
        'Le fichier que vous<br>n’oseriez envoyer<br>à personne est celui<br><span class="or">par où commencer.</span>',
      apres_phrase:
        'Le tri qu’on fait pour ne pas avoir honte supprime exactement ce qu’il fallait comprendre.',
    },
  ],
};
