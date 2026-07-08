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
  name: 'Nathan Princer Diffo', // TODO : confirmer l’orthographe exacte affichée
  initials: 'NPD',
  baseline: 'Développeur FullStack · Concepteur d’agents IA · Créateur de SaaS',
  location: 'Casablanca, Maroc · Remote', // TODO : ajuster si besoin
  email: 'nathan.diffo@mboservices.ma', // TODO : confirmer l’email public
  availabilityBadge: 'Disponible pour missions & collaborations',
  cvUrl: `${BASE}cv.pdf`, // Remplacez public/cv.pdf par votre vrai CV
}

/* ----------------------------- Hero ------------------------------------ */

export const hero = {
  // TODO : ajustez ces deux phrases si vous voulez un autre ton
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
    items: ['Node.js', 'Cloudflare Workers', 'Supabase', 'D1', 'REST API', 'Stripe'],
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
    items: ['Git / GitHub', 'Netlify', 'Vercel', 'WordPress / Elementor', 'Figma'],
  },
]

/* ----------------------------- Projets ---------------------------------- */

export const projects: Project[] = [
  {
    name: 'ConfluenceTerminal',
    tagline: 'Terminal d’analyse fondamentale de niveau institutionnel',
    description:
      'Verdicts de trading actionnables, backtest macro sur données réelles, contexte géopolitique en temps réel et IA conversationnelle — le tout dans une interface de niveau terminal professionnel.',
    tech: ['React 19', 'Vite', 'TypeScript', 'Tailwind', 'Cloudflare Workers', 'D1', 'Recharts / D3'],
    demoUrl: '', // TODO : URL de démo
    image: '', // TODO : capture d’écran → public/projects/confluenceterminal.png
    accentColor: 'success',
    privateSource: true,
  },
  {
    name: 'HopeJournal',
    tagline: 'Journal de trading avancé avec coach IA',
    description:
      'Backtesting intégré via widget TradingView, coach IA qui analyse vos trades, import CSV MT4/MT5, statistiques détaillées et courbes d’équité pour progresser en trading.',
    tech: ['React', 'Supabase', 'Groq', 'Recharts'],
    demoUrl: '', // TODO : URL de démo
    image: '',
    accentColor: 'accent',
    privateSource: true,
  },
  {
    name: 'Hope Traders Academy',
    tagline: 'Plateforme de formation au trading',
    description:
      'Espace membres complet : signaux avec notifications, parcours de formation sur 9 mois, espace admin et certificat de fin de formation.', // TODO : détails à confirmer
    tech: ['React', 'Cloudflare Pages', 'Workers', 'D1', 'Stripe'],
    demoUrl: 'https://vip.hopetraders.fr', // TODO : confirmer l’URL publique
    image: '',
    accentColor: 'warning',
    privateSource: true,
  },
  {
    name: 'Site vitrine ConfluenceTerminal',
    tagline: 'Landing page produit orientée conversion',
    description:
      'Page de vente du terminal : présentation des fonctionnalités, pricing, preuve sociale et parcours d’inscription optimisé pour la conversion.',
    tech: ['React', 'Vite', 'TypeScript', 'Tailwind'],
    demoUrl: '', // TODO : URL de démo
    image: '',
    accentColor: 'info',
    privateSource: true,
  },
  {
    name: 'Site vitrine HopeJournal',
    tagline: 'Landing page glassmorphism du journal de trading',
    description:
      'Landing page produit au design glassmorphism : mise en avant du coach IA, des statistiques et du backtesting pour convertir les traders en utilisateurs.',
    tech: ['React', 'Vite', 'Tailwind', 'Framer Motion'],
    demoUrl: '', // TODO : URL de démo
    image: '',
    accentColor: 'accent',
    privateSource: true,
  },
  {
    name: 'MBO Services',
    tagline: 'Site corporate — consulting IT',
    description:
      'Site vitrine WordPress sur-mesure pour un cabinet de consulting IT : thème personnalisé, pages construites avec Elementor, optimisation SEO et performance.',
    tech: ['WordPress', 'Elementor', 'PHP', 'SEO'],
    demoUrl: '', // TODO : URL du site (ex: https://www.mboservices.ma)
    image: '',
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
      'Conception et lancement de ConfluenceTerminal, terminal d’analyse fondamentale (données FRED, EIA, CFTC).',
      'Développement de HopeJournal, journal de trading avec coach IA et backtesting intégré.',
      'Mise en production de plateformes complètes : paiement Stripe, espaces membres, infrastructure Cloudflare.',
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
    role: 'Fondateur & développeur',
    company: 'Hope Traders',
    period: '2023 — Aujourd’hui',
    missions: [
      'Création de la plateforme de formation vip.hopetraders.fr : signaux, parcours de formation, certification.',
      'Développement d’un indicateur TradingView (Pine Script v6) utilisé par la communauté.',
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
    url: 'https://github.com/VOTRE_USERNAME', // TODO : remplacer par votre profil GitHub
    icon: GithubIcon,
  },
]

/* ------------------------------ Footer ---------------------------------- */

export const footer = {
  note: 'Conçu et développé avec React, TypeScript & Three.js.',
}
