/* ============================================================================
   BASCULE FR / EN
   ----------------------------------------------------------------------------
   Le contenu vit dans deux modules jumeaux : data/portfolio.ts (français) et
   data/portfolio.en.ts (anglais). Le typage `Record<Langue, typeof contenuFr>`
   fait échouer la compilation si l'anglais perd une clé en route — c'est la
   seule garantie qui tienne quand on édite le français six mois plus tard sans
   penser à la traduction.
============================================================================ */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import * as contenuFr from './data/portfolio'
import * as contenuEn from './data/portfolio.en'

export type Langue = 'fr' | 'en'
export type Contenu = typeof contenuFr

const CONTENUS: Record<Langue, Contenu> = { fr: contenuFr, en: contenuEn }

/** Clé de stockage — préfixée pour ne pas entrer en conflit sur github.io,
    où tous les projets d'un même compte partagent la même origine. */
const CLE_STOCKAGE = 'portfolio:langue'

const estLangue = (valeur: unknown): valeur is Langue => valeur === 'fr' || valeur === 'en'

/**
 * Ordre de priorité : `?lang=` dans l'URL (un lien partagé doit s'ouvrir dans
 * la langue de celui qui l'a envoyé), puis le choix mémorisé, puis la langue
 * du navigateur. Un visiteur anglophone tombe donc sur l'anglais sans rien
 * cliquer — c'est tout l'intérêt.
 */
function langueInitiale(): Langue {
  const demandee = new URLSearchParams(window.location.search).get('lang')
  if (estLangue(demandee)) return demandee
  try {
    const memorisee = localStorage.getItem(CLE_STOCKAGE)
    if (estLangue(memorisee)) return memorisee
  } catch {
    // Navigation privée ou stockage bloqué : on retombe sur le navigateur.
  }
  return navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : 'en'
}

/** Réécrit une balise <meta> existante ; ne crée rien (le HTML fait foi). */
function majMeta(attribut: 'name' | 'property', cle: string, valeur: string) {
  const balise = document.head.querySelector<HTMLMetaElement>(`meta[${attribut}="${cle}"]`)
  if (balise) balise.content = valeur
}

interface ValeurContexte {
  langue: Langue
  changerLangue: (langue: Langue) => void
  contenu: Contenu
}

const ContexteLangue = createContext<ValeurContexte | null>(null)

export function LangueProvider({ children }: { children: ReactNode }) {
  const [langue, setLangue] = useState<Langue>(langueInitiale)
  const contenu = CONTENUS[langue]

  // Les métadonnées suivent la langue : sinon un partage en anglais affiche un
  // titre français, et les lecteurs d'écran prononcent le texte avec la
  // mauvaise phonétique (`<html lang>` pilote la synthèse vocale).
  useEffect(() => {
    const { meta } = contenu
    document.documentElement.lang = meta.htmlLang
    document.title = meta.title
    majMeta('name', 'description', meta.description)
    majMeta('property', 'og:locale', meta.ogLocale)
    majMeta('property', 'og:title', meta.title)
    majMeta('property', 'og:description', meta.descriptionCourte)
    majMeta('name', 'twitter:title', meta.title)
    majMeta('name', 'twitter:description', meta.descriptionCourte)
  }, [contenu])

  const changerLangue = useCallback((suivante: Langue) => {
    setLangue(suivante)
    try {
      localStorage.setItem(CLE_STOCKAGE, suivante)
    } catch {
      // Stockage indisponible : le choix vaut pour la visite en cours.
    }
    // L'URL porte la langue pour que le rechargement et le copier-coller du
    // lien restent fidèles, sans ajouter d'entrée dans l'historique.
    const url = new URL(window.location.href)
    url.searchParams.set('lang', suivante)
    window.history.replaceState(null, '', url)
  }, [])

  const valeur = useMemo(
    () => ({ langue, changerLangue, contenu }),
    [langue, changerLangue, contenu],
  )

  return <ContexteLangue.Provider value={valeur}>{children}</ContexteLangue.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLangue(): ValeurContexte {
  const valeur = useContext(ContexteLangue)
  if (!valeur) throw new Error('useLangue doit être appelé dans <LangueProvider>')
  return valeur
}

/** Raccourci : le contenu de la langue active, mêmes clés dans les deux cas. */
// eslint-disable-next-line react-refresh/only-export-components
export function useContenu(): Contenu {
  return useLangue().contenu
}
