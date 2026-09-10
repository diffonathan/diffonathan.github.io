import { useEffect, useRef } from 'react'

/**
 * Halo lumineux qui suit le curseur — une torche posée sur la page sombre.
 *
 * ── Pourquoi ce n'est pas un état React ─────────────────────────────────────
 * Un `useState` mis à jour à chaque `mousemove` déclencherait un rendu React
 * par pixel parcouru : des centaines par seconde, pour ne changer que deux
 * nombres. On écrit donc directement dans deux variables CSS de l'élément, et
 * le compositeur du navigateur fait le reste. React ne rend ce composant
 * qu'une seule fois.
 *
 * ── Pourquoi requestAnimationFrame ──────────────────────────────────────────
 * Les événements de souris arrivent plus vite que l'écran ne rafraîchit. Sans
 * throttle, on écrirait plusieurs fois entre deux images, pour rien. On retient
 * la dernière position et on n'écrit qu'une fois par image.
 *
 * ── Quand la torche ne s'allume pas, et pourquoi ────────────────────────────
 * - `prefers-reduced-motion` : un halo qui poursuit le curseur est du mouvement
 *   permanent dans le champ de vision. Les personnes qui demandent moins de
 *   mouvement le demandent aussi pour ça.
 * - Pointeur grossier (tactile) : il n'y a pas de curseur à suivre. L'effet
 *   resterait figé là où le doigt a touché, et consommerait de la batterie pour
 *   afficher une tache immobile.
 *
 * ── Pourquoi le bleu et pas l'or ────────────────────────────────────────────
 * Dans la charte, l'or porte la VALEUR — un chiffre, un résultat. Le bleu est
 * la couleur de marque et de l'action. Une lumière d'ambiance n'est ni l'un ni
 * l'autre, mais l'or attirerait l'œil vers du décor au lieu du contenu. Le bleu
 * très dilué éclaire sans réclamer l'attention.
 */
export default function Torche() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const sansMouvement = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pointeurGrossier = window.matchMedia('(pointer: coarse)').matches
    if (sansMouvement || pointeurGrossier) return

    let x = 0
    let y = 0
    let enAttente = false

    const peindre = () => {
      enAttente = false
      el.style.setProperty('--torche-x', `${x}px`)
      el.style.setProperty('--torche-y', `${y}px`)
    }

    const surMouvement = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
      // La torche s'allume au premier mouvement, pas au chargement : sinon un
      // halo apparaîtrait en haut à gauche avant que l'utilisateur ait bougé.
      if (el.dataset.allumee !== '1') {
        el.dataset.allumee = '1'
        el.style.opacity = '1'
      }
      if (!enAttente) {
        enAttente = true
        requestAnimationFrame(peindre)
      }
    }

    // Le curseur quitte la fenêtre : on éteint plutôt que de laisser une tache
    // figée au dernier point connu.
    const surSortie = () => {
      el.style.opacity = '0'
      el.dataset.allumee = '0'
    }

    window.addEventListener('mousemove', surMouvement, { passive: true })
    document.addEventListener('mouseleave', surSortie)
    return () => {
      window.removeEventListener('mousemove', surMouvement)
      document.removeEventListener('mouseleave', surSortie)
    }
  }, [])

  return <div ref={ref} className="torche" aria-hidden="true" />
}
