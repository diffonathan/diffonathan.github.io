import { useCallback, useEffect, useRef, useState } from 'react'
import type { DemoGuidee } from '../data/portfolio'

interface Props {
  demo: DemoGuidee
  projet: string
  onClose: () => void
}

/**
 * Démo guidée d'un outil métier — visite étape par étape, en modale.
 *
 * Ces applications (Project Tracker, HR Recrutement) ne sont pas publiées :
 * ce sont des outils internes qui manipulent des candidats et des appels
 * d'offres réels. Les captures présentées ici viennent d'instances de
 * démonstration peuplées de données entièrement fictives, tournées en local.
 * Une démo interactive publique aurait exposé le même socle que la production.
 */
export default function DemoWalkthrough({ demo, projet, onClose }: Props) {
  const [i, setI] = useState(0)
  const etape = demo.etapes[i]
  const dernier = demo.etapes.length - 1
  const boiteRef = useRef<HTMLDivElement>(null)

  const precedent = useCallback(() => setI((n) => Math.max(0, n - 1)), [])
  const suivant = useCallback(() => setI((n) => Math.min(dernier, n + 1)), [dernier])

  // Clavier : Échap ferme, les flèches naviguent. Le défilement de la page
  // derrière est verrouillé le temps de la visite.
  useEffect(() => {
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') suivant()
      else if (e.key === 'ArrowLeft') precedent()
    }
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', surTouche)
    boiteRef.current?.focus()
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', surTouche)
    }
  }, [onClose, suivant, precedent])

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6"
      style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        ref={boiteRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`Démo guidée — ${projet}`}
        className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-card outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-accent">Démo guidée</p>
            <h3 className="truncate text-lg font-bold text-foreground">{projet}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la démo"
            className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-sm text-secondary hover:text-foreground"
          >
            Fermer
          </button>
        </div>

        {/* Capture de l'étape */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <img
            src={etape.image}
            alt={etape.titre}
            className="w-full border-b border-border"
            loading="lazy"
          />
          <div className="px-5 py-4">
            <p className="text-xs font-semibold text-secondary">
              Étape {i + 1} / {demo.etapes.length}
            </p>
            <h4 className="mt-1 text-base font-bold text-foreground">{etape.titre}</h4>
            <p className="mt-1.5 text-sm leading-relaxed text-body">{etape.texte}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-3">
          <div className="flex gap-1.5" aria-hidden>
            {demo.etapes.map((_, n) => (
              <span
                key={n}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: n === i ? 22 : 8,
                  background: n === i ? 'var(--color-accent)' : 'var(--color-border)',
                }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={precedent}
              disabled={i === 0}
              className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-secondary disabled:opacity-40 hover:text-foreground"
            >
              Précédent
            </button>
            <button
              type="button"
              onClick={i === dernier ? onClose : suivant}
              className="rounded-lg px-4 py-2 text-sm font-bold text-white"
              style={{ background: 'var(--color-accent)' }}
            >
              {i === dernier ? 'Terminer' : 'Suivant'}
            </button>
          </div>
        </div>

        {/* Mention de loyauté : le visiteur doit savoir ce qu'il regarde. */}
        <p className="border-t border-border px-5 py-2 text-[11px] text-secondary">
          Captures d’une instance de démonstration — clients, candidats et dossiers sont
          <strong className="text-body"> entièrement fictifs</strong>. L’outil en production
          traite des données confidentielles et n’est pas ouvert au public.
        </p>
      </div>
    </div>
  )
}
