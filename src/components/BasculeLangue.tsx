import { useLangue } from '../i18n'
import type { Langue } from '../i18n'

/* Deux boutons plutôt qu'une liste déroulante : avec deux langues, un menu
   demande deux gestes là où un interrupteur en demande un, et l'état courant
   se lit sans l'ouvrir. */
const OPTIONS: { code: Langue; court: string }[] = [
  { code: 'fr', court: 'FR' },
  { code: 'en', court: 'EN' },
]

export default function BasculeLangue({ className = '' }: { className?: string }) {
  const { langue, changerLangue, contenu } = useLangue()
  const { ui } = contenu

  return (
    <div
      role="group"
      aria-label={ui.langueLabel}
      className={`flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5 ${className}`}
    >
      {OPTIONS.map(({ code, court }) => {
        const actif = code === langue
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-pressed={actif}
            onClick={() => changerLangue(code)}
            className={`min-h-9 cursor-pointer rounded-md px-2.5 text-xs font-semibold transition-colors duration-200 ${
              actif ? 'bg-accent text-white' : 'text-secondary hover:text-foreground'
            }`}
          >
            <span aria-hidden="true">{court}</span>
            {/* Le lecteur d'écran entend la langue en toutes lettres : « FR »
                seul ne dit rien, et le sigle est épelé de travers. */}
            <span className="sr-only">{ui.langueNom[code]}</span>
          </button>
        )
      })}
    </div>
  )
}
