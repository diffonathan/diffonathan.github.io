/* ============================================================================
   CONTENU DU PORTFOLIO — fichier unique à éditer
   ----------------------------------------------------------------------------
   Tout le contenu du site (textes, projets, liens, stats) vit ici.
   Modifiez les valeurs ci-dessous sans toucher aux composants.
   Les lignes marquées "TODO" sont à personnaliser / confirmer.
============================================================================ */

import type { ComponentType, SVGProps } from 'react'
import {
  Bot,
  Code2,
  Globe,
  Layers,
  Mail,
  Rocket,
  Server,
  Sparkles,
  Wrench,
} from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '../components/ui/BrandIcons'

/** Interface commune aux icônes Lucide et aux icônes de marque maison. */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>

/* Préfixe de base du site : "/" en local, "/diffonathan/" sur GitHub Pages.
   Sert à préfixer les fichiers de /public (CV, photo) pour éviter les 404. */
const BASE = import.meta.env.BASE_URL

/* ----------------------------- Types ----------------------------------- */

export interface Stat {
  value: number
  suffix: string
  label: string
}

export interface StackCategory {
  title: string
  icon: IconComponent
  items: string[]
}

/** Une étape de démo guidée : une capture + ce qu'elle montre. */
export interface DemoEtape {
  image: string
  titre: string
  texte: string
}

/** Visite guidée d'un outil non publié, présentée en modale. */
export interface DemoGuidee {
  etapes: DemoEtape[]
}

export interface Project {
  name: string
  tagline: string
  description: string
  tech: string[]
  /** URL de la démo live — laisser vide ("") pour masquer le bouton. */
  demoUrl: string
  /** Chemin d’une capture d’écran dans /public (ex: "/projects/confluence.png").
      Laisser vide pour afficher le placeholder stylisé. */
  image: string
  /** Couleur d’accent du placeholder (token CSS). */
  accentColor: 'accent' | 'success' | 'info' | 'warning' | 'danger'
  privateSource: boolean
  /** Visite guidée — pour les outils métier qui ne peuvent pas être ouverts
      au public (ils traitent des candidats et des appels d'offres réels). */
  demo?: DemoGuidee
}

export interface Service {
  title: string
  description: string
  icon: IconComponent
}

export interface ExperienceItem {
  role: string
  company: string
  period: string
  missions: string[]
}

export interface SocialLink {
  label: string
  url: string
  icon: IconComponent
}

/* --------------------------- Identité ---------------------------------- */

export const identity = {
  name: 'Nathan Princer Diffo',
  initials: 'NPD',
  baseline: 'Développeur FullStack · Concepteur d’agents IA · Créateur de SaaS',
  location: 'Casablanca, Maroc · Remote',
  email: 'diffoprincer@gmail.com', // adresse PERSONNELLE — le portfolio ne
  // relève pas de MBO Services, l'adresse professionnelle n'y a pas sa place.
  availabilityBadge: 'Disponible pour missions & collaborations',
  cvUrl: `${BASE}cv.pdf`, // Remplacez public/cv.pdf par votre vrai CV
}

/* ----------------------------- Hero ------------------------------------ */

export const hero = {
  subtitle:
    'De l’idée au produit en production : j’architecture des applications web performantes, ' +
    'des agents IA et des plateformes SaaS complètes — front, back, paiement et déploiement inclus.',
  ctaPrimary: 'Voir mes projets',
  ctaSecondary: 'Télécharger mon CV',
}

/* --------------------------- Navigation --------------------------------- */

export const navLinks = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'Projets', href: '#projets' },
  { label: 'Stack', href: '#stack' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
]

export const navCta = { label: 'Me contacter', href: '#contact' }

/* ---------------------------- À propos ---------------------------------- */

export const about = {
  title: 'À propos',
  // TODO : personnalisez cette bio
  bio: [
    'Développeur FullStack passionné par les produits qui vont au bout : je conçois, développe et déploie des applications web complètes — de l’interface au backend, de l’authentification au paiement Stripe.',
    'Mon terrain de jeu : les SaaS exigeants (analyse financière institutionnelle, journaux de trading, plateformes de formation) et les agents IA qui automatisent les tâches répétitives. J’aime les interfaces sombres et précises, le code typé strict et les produits qui se déploient en un clic.',
  ],
  photoUrl: `${BASE}profile.jpg`, // Remplacez public/profile.jpg par votre photo (carrée)
}

// TODO : confirmer ces chiffres
export const stats: Stat[] = [
  { value: 3, suffix: '+', label: 'Années d’expérience' },
  { value: 10, suffix: '+', label: 'Projets livrés' },
  { value: 4, suffix: '', label: 'SaaS conçus' },
]

/* ------------------------- Stack technique ------------------------------ */

export const stackSection = {
  title: 'Stack technique',
  subtitle: 'Les technologies que j’utilise au quotidien pour construire des produits solides.',
}

export const stackCategories: StackCategory[] = [
  {
    title: 'Frontend',
    icon: Layers,
    items: ['React', 'Vite', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    title: 'Backend',
    icon: Server,
    items: ['Node.js', 'Cloudflare Workers', 'D1 / KV', 'Supabase', 'FastAPI', 'Stripe'],
  },
  {
    title: 'Intelligence Artificielle',
    icon: Sparkles,
    items: [
      'Conception d’agents IA',
      'Intégration LLM',
      'Groq / Claude / OpenAI',
      'Automatisations',
    ],
  },
  {
    title: 'Outils',
    icon: Wrench,
    items: [
      'Git / GitHub',
      'Cloudflare Pages',
      'GitHub Actions',
      'Docker / Caddy',
      'WordPress / Elementor',
      'Figma',
    ],
  },
]

/* ----------------------------- Projets ---------------------------------- */

export const projects: Project[] = [
  {
    name: 'ConfluenceTerminal',
    tagline: 'Terminal d’analyse fondamentale de niveau institutionnel',
    description:
      'Verdict directionnel sur 150+ actifs et 3 horizons, croisant macro (FRED), positionnement institutionnel (COT/CFTC), énergie (EIA), géopolitique (GDELT) et backtest historique. Comptes, essai de 30 jours et abonnement Stripe ; alertes Telegram avant les publications à fort impact.',
    tech: ['React', 'TypeScript', 'Tailwind', 'Cloudflare Workers', 'D1', 'Stripe', 'Groq', 'TradingView'],
    demoUrl: 'https://confluenceterminal.hopetraders.fr',
    image: `${BASE}projects/confluenceterminal.jpg`,
    accentColor: 'info',
    privateSource: true,
  },
  {
    name: 'Hope Traders Academy',
    tagline: 'Plateforme de formation et de signaux de trading',
    description:
      'Espace membres complet : signaux en direct avec notifications push, formation de 72 vidéos débloquées par paliers, webinaire hebdomadaire, messagerie avec l’équipe, réservation d’appels, espace admin et certificat. Trois formules de paiement Stripe, application installable (PWA).',
    tech: ['React', 'TypeScript', 'Cloudflare Pages', 'Workers', 'D1 / KV', 'Stripe', 'PWA'],
    demoUrl: 'https://vip.hopetraders.fr',
    image: `${BASE}projects/hopetraders.jpg`,
    accentColor: 'warning',
    privateSource: true,
  },
  {
    name: 'HopeJournal',
    tagline: 'Journal de trading avec coach IA',
    description:
      'Journal complet pour traders : import CSV MT4/MT5, statistiques et courbes d’équité, backtesting via widget TradingView, et un coach IA qui analyse les trades pour identifier les schémas récurrents.',
    tech: ['React', 'TypeScript', 'Supabase', 'Groq', 'Recharts'],
    demoUrl: 'https://hopejournal.hopetraders.fr',
    image: `${BASE}projects/hopejournal-site.jpg`,
    accentColor: 'accent',
    privateSource: true,
  },
  {
    name: 'Project Tracker',
    tagline: 'Pipeline de réponse aux appels d’offres, assisté par IA',
    description:
      'Application métier qui industrialise la réponse aux appels d’offres : extraction automatique des dates et du périmètre depuis les documents, workflow en 9 étapes verrouillées, revue technique produite par un LLM en tâche de fond, génération documentaire et détection des doublons.',
    tech: ['FastAPI', 'Python', 'JavaScript', 'Docker', 'Caddy', 'Groq'],
    demoUrl: 'https://tracker.mboservices.tech',
    image: `${BASE}demo/tracker-tableau-de-bord.jpg`,
    accentColor: 'success',
    privateSource: true,
    demo: {
      etapes: [
        {
          image: `${BASE}demo/tracker-tableau-de-bord.jpg`,
          titre: 'Pilotage : où en est chaque dossier',
          texte:
            'Le tableau de bord agrège les appels d’offres en cours : volume traité, taux de transformation, montants engagés et répartition par statut. Les filtres par année et par mois permettent de comparer deux périodes sans quitter la page.',
        },
        {
          image: `${BASE}demo/tracker-projets.jpg`,
          titre: 'Un workflow en 9 étapes, verrouillé',
          texte:
            'Chaque dossier suit un parcours imposé, du NDA à la facturation. Une étape ne s’ouvre que si la précédente est close : c’est ce qui empêche un dossier de partir sans revue technique ou sans pièce obligatoire.',
        },
        {
          image: `${BASE}demo/tracker-documentation.jpg`,
          titre: 'La documentation vit dans l’outil',
          texte:
            'Chaque écran embarque son mode d’emploi et une visite de première connexion. L’outil est utilisé par des profils non techniques : la prise en main devait tenir sans formation.',
        },
      ],
    },
  },
  {
    name: 'Application de recrutement',
    tagline: 'Gestion RH connectée à Microsoft 365',
    description:
      'Outil de recrutement autonome : suivi des candidats, génération de huit documents contractuels par gabarits, trigramme RH, conformité RGPD et intégration SharePoint / Microsoft 365. Déployée sur VPS en conteneurs.',
    tech: ['FastAPI', 'Python', 'Docker', 'Caddy', 'Microsoft Graph', 'Groq'],
    demoUrl: 'https://rh.mboservices.tech',
    image: `${BASE}demo/rh-suivi.jpg`,
    accentColor: 'accent',
    privateSource: true,
    demo: {
      etapes: [
        {
          image: `${BASE}demo/rh-tableau-de-bord.jpg`,
          titre: 'Du besoin au poste, en une saisie',
          texte:
            'L’outil lit l’e-mail d’expression du besoin (ou un texte collé), pré-remplit la fiche de poste, puis numérote le dossier, crée son arborescence d’étapes et génère le formulaire de besoin et l’annonce en Word et PDF.',
        },
        {
          image: `${BASE}demo/rh-recrutement.jpg`,
          titre: 'Le parcours candidat, étape par étape',
          texte:
            'Chaque candidat avance dans un pipeline dont l’étape courante range physiquement son CV dans le bon sous-dossier. Le trigramme RH est dérivé du nom et sert d’identifiant tout au long du processus.',
        },
        {
          image: `${BASE}demo/rh-suivi.jpg`,
          titre: 'Un suivi qui remplace le fichier Excel',
          texte:
            'La table de suivi reprend exactement les colonnes du tableau Excel qu’elle remplace — et s’exporte au même format. La reprise a été pensée pour ne rien imposer de nouveau à l’équipe RH. Une purge RGPD est intégrée.',
        },
      ],
    },
  },
  {
    name: 'MBO Services',
    tagline: 'Site corporate — ESN / conseil IT',
    description:
      'Site vitrine haut de gamme pour une ESN (Cloud, Cybersécurité, Data & IA) : Next.js en export statique, animations Motion, design soigné et accessibilité.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Motion'],
    demoUrl: '',
    image: `${BASE}projects/mbo-services.jpg`,
    accentColor: 'info',
    privateSource: true,
  },
]

export const projectsSection = {
  title: 'Projets phares',
  subtitle:
    'Une sélection de produits conçus, développés et mis en production de bout en bout.',
  privateNote: 'Code source privé — accès sur demande',
  demoLabel: 'Démo live',
}

/* ----------------------------- Services --------------------------------- */

export const services: Service[] = [
  {
    title: 'Développement FullStack sur-mesure',
    description:
      'Applications web complètes : architecture, base de données, API, interface et déploiement. TypeScript strict, tests et performance au rendez-vous.',
    icon: Code2,
  },
  {
    title: 'Conception d’agents IA & automatisations',
    description:
      'Agents IA intégrés à vos outils (Groq, Claude, OpenAI) : analyse de documents, assistants métier, workflows automatisés qui font gagner des heures.',
    icon: Bot,
  },
  {
    title: 'Création de SaaS (MVP → production)',
    description:
      'Du prototype validé au produit qui encaisse : authentification, abonnements Stripe, espace membres, infrastructure serverless à coût maîtrisé.',
    icon: Rocket,
  },
  {
    title: 'Sites web & landing pages performantes',
    description:
      'Sites vitrines et landing pages orientés conversion : design soigné, SEO, temps de chargement optimisés et intégration analytics.',
    icon: Globe,
  },
]

export const servicesSection = {
  title: 'Services',
  subtitle: 'Ce que je peux construire pour vous.',
}

/* ---------------------------- Expérience -------------------------------- */

// TODO : personnalisez postes, entreprises et dates
export const experience: ExperienceItem[] = [
  {
    role: 'Créateur de SaaS & concepteur d’agents IA',
    company: 'Indépendant',
    period: '2024 — Aujourd’hui',
    missions: [
      'Conception et mise en production de ConfluenceTerminal : données FRED, EIA, CFTC et GDELT, verdict sur 150+ actifs, abonnement Stripe.',
      'Développement de HopeJournal, journal de trading avec coach IA, import MT4/MT5 et backtesting intégré.',
      'Plateformes complètes de bout en bout : authentification, paiement Stripe, espaces membres, PWA et infrastructure serverless Cloudflare.',
    ],
  },
  {
    role: 'Développeur FullStack',
    company: 'MBO Services — Consulting IT',
    period: '2023 — Aujourd’hui',
    missions: [
      'Développement d’outils métier internes : gestion d’appels d’offres, application de recrutement connectée à Microsoft 365.',
      'Refonte du site corporate WordPress avec thème sur-mesure et Elementor.',
      'Automatisation de processus documentaires (génération de documents, notifications, relances).',
    ],
  },
  {
    role: 'Co-fondateur & développeur',
    company: 'Hope Traders Academy',
    period: '2023 — Aujourd’hui',
    missions: [
      'Conception et développement de vip.hopetraders.fr : signaux en direct, formation, paiements Stripe, espace admin et application installable.',
      'Développement d’un indicateur TradingView (Pine Script v6) utilisé par la communauté.',
      'Conception de HopeJournal et de ConfluenceTerminal, les deux outils de l’écosystème.',
    ],
  },
]

export const experienceSection = {
  title: 'Expérience',
  subtitle: 'Mon parcours en quelques étapes clés.',
}

/* ----------------------------- Contact ---------------------------------- */

export const contact = {
  title: 'Contact',
  subtitle:
    'Un projet, une mission, une idée de SaaS ? Parlons-en — je réponds sous 24h.',
  formLabels: {
    name: 'Nom',
    email: 'Email',
    message: 'Message',
    submit: 'Envoyer le message',
    sending: 'Envoi en cours…',
    success: 'Message envoyé ! Je vous réponds au plus vite.',
    error: 'L’envoi a échoué. Écrivez-moi directement par email.',
    mailtoInfo: 'Votre client mail va s’ouvrir avec le message pré-rempli.',
    namePlaceholder: 'Votre nom',
    emailPlaceholder: 'vous@exemple.com',
    messagePlaceholder: 'Décrivez votre projet ou votre besoin…',
  },
}

export const socials: SocialLink[] = [
  {
    label: 'Email',
    url: `mailto:${identity.email}`,
    icon: Mail,
  },
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/nathan-princer-diffo',
    icon: LinkedinIcon,
  },
  {
    label: 'GitHub',
    url: 'https://github.com/diffonathan',
    icon: GithubIcon,
  },
]

/* ------------------------------ Footer ---------------------------------- */

export const footer = {
  note: 'Conçu et développé avec React, TypeScript & Three.js.',
}
