import Reveal from './Reveal'

interface SectionHeadingProps {
  title: string
  subtitle?: string
}

/**
 * Titre de section — le DERNIER MOT passe au dégradé or/feu.
 *
 * Le trait horizontal qui soulignait le titre a été retiré : il ajoutait un
 * élément décoratif sans rien dire, et il fallait le regarder pour comprendre
 * qu'il portait la couleur de marque. Colorer le dernier mot met l'accent
 * DANS le texte plutôt qu'à côté — c'est la façon dont les titres sont traités
 * sur les sites Hope Traders, et ça relie les deux univers sans les confondre.
 *
 * Sur un titre d'un seul mot (« Services », « Expérience »), le mot entier
 * passe au dégradé : le résultat reste cohérent, il n'y a pas de cas à part.
 */
export default function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  const mots = title.trim().split(' ')
  const dernier = mots.pop() ?? title
  const debut = mots.join(' ')

  return (
    <Reveal className="mb-12 text-center">
      <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
        {debut && `${debut} `}
        <span className="grad-text">{dernier}</span>
      </h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-secondary">
          {subtitle}
        </p>
      )}
    </Reveal>
  )
}
