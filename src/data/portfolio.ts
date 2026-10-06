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
  Layers,
  Mail,
  Megaphone,
  Phone,
  Rocket,
  Server,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Workflow,
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
  /** Dépôt public. Renseigné uniquement quand le code peut VRAIMENT être lu :
      un lien vers un dépôt privé n'apprend rien et se termine en 404. */
  codeUrl?: string
  /** Chemin d’une capture d’écran dans /public (ex: "/projects/confluence.png").
      Laisser vide pour afficher le placeholder stylisé. */
  image: string
  /** Couleur d’accent du placeholder (token CSS). */
  accentColor: 'accent' | 'success' | 'info' | 'warning' | 'danger'
  privateSource: boolean
  /** Outil interne d'un commanditaire : pas d'adresse publique, et on ne la
      cite pas. Un lien vers une page de connexion n'apprend rien à un visiteur
      mais expose l'existence et l'adresse d'un outil qui ne nous appartient
      pas. La démonstration guidée, sur données fictives, montre davantage sans
      rien divulguer. */
  internalTool?: boolean
  /** L'application dort quand personne ne la visite.
      Les hébergements gratuits endorment un service après quelques minutes
      d'inactivité ; le réveil prend 40 à 60 secondes. Le dire évite qu'une
      page blanche d'une minute passe pour une panne — c'est la différence
      entre « c'est lent » et « c'est cassé ». */
  demoEveil?: boolean

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

/** Une façon de travailler ensemble (freelance, salariat à distance, sur site). */
export interface Modalite {
  label: string
  detail: string
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
  // Même positionnement que le CV et la bannière LinkedIn. « Full Stack » en
  // deux mots : c'est la forme qu'indexe la recherche LinkedIn.
  baseline: 'Développeur Full Stack · Digitalisation des processus métier',
  location: 'Marrakech, Maroc',
  /** Format E.164 pour le lien `tel:` ; l'affichage est espacé pour la lecture. */
  telephone: '+212660179871',
  telephoneAffiche: '+212 660 179 871',
  email: 'diffoprincer@gmail.com', // adresse PERSONNELLE — le portfolio ne
  // relève pas de MBO Services, l'adresse professionnelle n'y a pas sa place.
  availabilityBadge: 'Disponible — freelance ou poste à distance',
  // Générés par `npm run cv` depuis src/data/cv.json et cv-en.json — ne jamais
  // éditer les PDF à la main, ils sont écrasés à chaque génération.
  cvUrl: `${BASE}cv.pdf`,
  cvUrlEn: `${BASE}cv-en.pdf`,
}

/* ----------------------------- Hero ------------------------------------ */

export const hero = {
  subtitle:
    'Je transforme des processus qui vivent dans des fichiers Excel et des modèles Word ' +
    'en applications que les équipes utilisent tous les jours — de l’interface au serveur, ' +
    'paiement et mise en ligne compris.',
  ctaPrimary: 'Voir mes projets',
  ctaSecondary: 'Télécharger mon CV',
  // La version anglaise vit sous les boutons plutôt qu'en troisième bouton :
  // trois appels à l'action se concurrencent, et la majorité des lecteurs
  // visés sont francophones. Elle reste visible pour qui la cherche.
  cvEnPrefix: 'CV également disponible ',
  cvEnLabel: 'en anglais',
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
  bio: [
    'Je conçois et mets en production des applications de bout en bout : l’interface, le serveur, la base de données, le paiement, la mise en ligne — et la prise en main par ceux qui s’en servent.',
    'Ce que je fais le plus souvent : remplacer des processus qui vivent dans des fichiers Excel et des modèles Word par un outil que l’équipe adopte. Un outil interne échoue rarement sur la technique — il échoue parce que personne ne l’ouvre. C’est ce qui m’intéresse dans ce métier.',
  ],
  photoUrl: `${BASE}profile.jpg`,
  /** Vignette ronde de la barre de navigation — même cadrage que le portrait
      du carrousel, rendue à 144 px pour rester nette sur écran dense. */
  avatarUrl: `${BASE}avatar.png`,
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
  subtitle: 'Les technologies avec lesquelles je conçois, développe et mets en production.',
}

export const stackCategories: StackCategory[] = [
  {
    title: 'Frontend',
    icon: Layers,
    items: [
      'React',
      'Angular',
      'Blade',
      'Vite',
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Framer Motion',
    ],
  },
  {
    title: 'Backend',
    icon: Server,
    items: [
      'Node.js',
      'FastAPI / Python',
      'Laravel',
      'Symfony',
      'Yii2',
      'Java / Spring Boot',
      'Cloudflare Workers',
      'D1 / KV / Supabase',
      'Apache Kafka',
      'Stripe',
    ],
  },
  {
    title: 'Mobile',
    icon: Smartphone,
    items: ['Flutter', 'Dart', 'Kotlin', 'Firebase'],
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
    title: 'Web & acquisition',
    icon: Megaphone,
    items: ['WordPress / Elementor', 'WooCommerce', 'Systeme.io', 'Tunnels de vente', 'Envato'],
  },
  {
    title: 'Outils',
    icon: Wrench,
    items: ['Git / GitHub', 'GitHub Actions', 'Docker / Caddy', 'Cloudflare Pages', 'Figma'],
  },
]

/* ----------------------------- Projets ---------------------------------- */

export const projects: Project[] = [
  {
    name: 'Mizan',
    tagline: 'Répondre sur le Code du travail marocain, ou se taire',
    description:
      'Un salarié marocain qui se demande à quoi il a droit tombe sur un forum, sur un PDF de trois cents pages, ou sur une IA qui lui sort un numéro d’article qui n’existe pas. Ce qui manque n’est pas une réponse : c’est une réponse dont on puisse vérifier la source, et un système qui se taise quand il ne sait pas au lieu de fabriquer un article plausible. Mizan lit les 589 articles du Code du travail, ne répond que s’il a retrouvé les textes, et rejette en entier toute rédaction qui cite un article absent de ce qu’il a réellement récupéré — 31 inventions fabriquées pour l’épreuve, 31 arrêtées. Le projet ne promet rien qu’une commande du dépôt ne réimprime.',
    tech: ['Python', 'FastAPI', 'RAG', 'BM25', 'embeddinggemma-300m', 'ONNX Runtime', 'Docker', 'unittest'],
    demoUrl: 'https://nathanprincer-mizan-tutoriel.static.hf.space',
    codeUrl: 'https://github.com/diffonathan/mizan',
    image: `${BASE}projects/mizan.jpg`,
    accentColor: 'accent',
    privateSource: false,
    demo: {
      etapes: [
        {
          image: `${BASE}projects/mizan-silence.jpg`,
          titre: 'Se taire est une réponse',
          texte:
            '« Comment déclarer mes revenus fonciers ? » n’a pas de réponse dans le Code du travail. Mizan ne rédige rien, et le modèle n’est même pas appelé — on n’invente pas ce qu’on n’a pas demandé. L’écran dit pourquoi : l’article le plus proche plafonne à 0,27 de proximité pour un seuil de 0,46, et il nomme les mots que le Code n’emploie jamais. Les textes approchants restent affichés, mais étiquetés CANDIDAT et non CITÉ. Sur les 36 questions du jeu qui n’ont pas de réponse dans le Code, 27 reçoivent ce silence.',
        },
        {
          image: `${BASE}projects/mizan-tutoriel.jpg`,
          titre: 'La garde des citations, prise sur le fait',
          texte:
            'C’est la seule vraie garantie du projet, et elle est invisible tant que tout va bien : le tutoriel la met donc en scène. On fait citer au rédacteur trois articles — 269 et 270, réellement retrouvés, et 1098, qui existe dans un AUTRE code. La réponse entière est rejetée. Ce n’est pas un filtre de probabilité mais une appartenance à un ensemble, affichée en clair : citations lues {269, 270, 1098}, articles récupérés {269, 270, 154, 13, 219}, inclusion rompue par 1098. Une réponse à moitié inventée n’est pas rapiécée.',
        },
        {
          image: `${BASE}projects/mizan-article.jpg`,
          titre: 'Un article sans son chapitre ne dit pas la même chose',
          texte:
            'L’article 231 arrive avec sa place exacte dans le Code : Livre II — Des conditions de travail et de la rémunération du salarié, Titre III — De la durée du travail, Chapitre IV — Du congé annuel payé, Section I. En droit, c’est cette hiérarchie qui dit à qui le texte s’applique, et une réponse qui la retire n’est plus vérifiable. La carte indique aussi par quel bras de recherche l’article a été trouvé et la page du PDF officiel, pour qu’on puisse contrôler ailleurs que dans l’application.',
        },
        {
          image: `${BASE}projects/mizan.jpg`,
          titre: 'Ce que le projet dit contre lui-même',
          texte:
            'Deux bandeaux sont là avant qu’on ait posé la moindre question. Le corpus est consolidé au 26 octobre 2011 : ce n’est pas l’état du droit aujourd’hui, et aucune jurisprudence n’y figure. Et sans clé de modèle, la rédaction affichée est factice — la RECHERCHE des articles, elle, est réelle, et c’est elle qui est mesurée. Le dossier nomme lui-même son plus gros trou : la garde vérifie une provenance, pas une pertinence, donc un article réel cité à tort passe.',
        },
      ],
    },
  },
  {
    name: 'Artisans.ma',
    tagline: 'Trouver un artisan qui accepte de venir chez vous',
    description:
      'Pour faire venir un plombier chez soi au Maroc, on appelle un numéro recopié sur un bout de papier, puis un deuxième, puis un troisième. On ne sait pas lequel se déplacera jusqu’à son adresse, ni combien il demandera avant d’avoir raccroché. La recherche ne montre donc pas les artisans les plus proches, mais ceux dont le rayon couvre l’adresse du chantier : un peintre d’Essaouira à 168 km apparaît, un menuisier à 30 km qui ne sort pas de sa vallée n’apparaît pas. Et un avis n’existe que si la prestation a été payée puis déclarée terminée.',
    tech: ['NestJS', 'GraphQL', 'MongoDB', 'Next.js 16', 'React 19', 'TypeScript', 'Docker', 'Vitest'],
    demoUrl: 'https://artisans-ma.onrender.com',
    demoEveil: true,
    codeUrl: 'https://github.com/diffonathan/artisans-ma',
    image: `${BASE}projects/artisans.jpg`,
    accentColor: 'info',
    privateSource: false,
    demo: {
      etapes: [
        {
          image: `${BASE}projects/artisans.jpg`,
          titre: 'La question n’est pas « qui est près de moi »',
          texte:
            'Chaque artisan déclare SON rayon d’intervention, et c’est lui qui décide. Le peintre d’Essaouira se déplace à 200 km : il apparaît pour un chantier à Marrakech, à 168 km de chez lui. Le menuisier de Tahannaout, à 30 km du même chantier, n’apparaît pas — son rayon s’arrête à 10 km. Un seuil unique de distance ne peut pas produire ce résultat : réglé à 30 km il garderait le mauvais, réglé à 200 km il garderait les deux.',
        },
        {
          image: `${BASE}projects/artisans-devis.jpg`,
          titre: 'Comparer, puis trancher',
          texte:
            'Le client décrit son chantier une fois ; les artisans du secteur répondent par un montant, un délai et ce qu’ils comptent faire. En accepter un refuse automatiquement les autres et fige le montant sur la réservation — si l’artisan modifie son devis ensuite, l’accord conclu ne bouge pas. L’écran dit ce que le clic déclenche avant qu’on clique.',
        },
        {
          image: `${BASE}projects/artisans-chantiers.jpg`,
          titre: 'Ce que l’artisan voit, et ce qu’il ne voit pas',
          texte:
            'Les chantiers de son rayon, avec la distance et le prénom du client — jamais l’adresse exacte ni le téléphone. Ils n’arrivent qu’avec la réservation, c’est-à-dire une fois le devis retenu. Ce n’est pas un contrôle d’accès posé par-dessus : l’adresse est recopiée sur la réservation, donc elle n’est pas là où il ne doit pas la lire.',
        },
        {
          image: `${BASE}projects/artisans-technique.jpg`,
          titre: 'Ce que la base ne peut pas garantir, écrit noir sur blanc',
          texte:
            'MongoDB n’a pas de clé étrangère : rien ne l’empêche d’accepter un avis qui ne correspond à aucune prestation. Plutôt que de le prétendre impossible, l’application le dit, le remplace par trois mécanismes vérifiables, et surveille le reste par une commande de contrôle. La page technique explique le raisonnement, les mesures et les erreurs trouvées en chemin.',
        },
      ],
    },
  },
  {
    name: 'RDV Santé',
    tagline: 'Prise de rendez-vous et file d’attente en temps réel',
    description:
      'Au Maroc, on prend rendez-vous par téléphone et on attend en salle sans savoir combien de personnes précèdent. Ici, le patient réserve en ligne et suit sa position depuis son téléphone ; le secrétariat pilote la journée depuis un seul écran. Quatre services indépendants qui ne s’appellent jamais directement : ils s’échangent des événements, et si l’un tombe les autres continuent.',
    tech: ['Java 21', 'Spring Boot', 'Microservices', 'Apache Kafka', 'PostgreSQL', 'Angular', 'Docker', 'Testcontainers'],
    demoUrl: 'https://rdv-sante.onrender.com',
    demoEveil: true,
    codeUrl: 'https://github.com/diffonathan/rdv-sante',
    image: `${BASE}projects/rdv-sante.jpg`,
    accentColor: 'success',
    privateSource: false,
    demo: {
      etapes: [
        {
          image: `${BASE}projects/rdv-sante-reservation.jpg`,
          titre: 'Le rendez-vous se prend en trois gestes',
          texte:
            'Une clinique, un praticien, un créneau — puis trois champs. Les horaires déjà pris ne sont pas proposés, et deux patients qui visent la même case ne peuvent pas réussir tous les deux : c’est un index unique partiel qui l’interdit dans la base, pas une vérification dans le code. Le bandeau rappelle que tout est fictif — une application de santé ne se démontre pas sur de vraies données.',
        },
        {
          image: `${BASE}projects/rdv-sante.jpg`,
          titre: 'L’écran de la salle d’attente',
          texte:
            'Pensé pour une télévision accrochée au mur, lu debout à trois mètres : une seule information importante — qui est appelé — et les suivants en dessous. Il se met à jour dès que le secrétariat agit, sans rechargement et sans que personne n’y touche.',
        },
        {
          image: `${BASE}projects/rdv-sante-secretariat.jpg`,
          titre: 'Le secrétariat, en un seul écran',
          texte:
            'Les rendez-vous attendus à droite, la file à gauche. Pointer une arrivée fait entrer le patient dans la file ; « Appeler le suivant » le fait passer en consultation. Le rang n’est jamais saisi à la main : il se déduit de l’heure d’arrivée, donc il ne peut pas se désynchroniser.',
        },
        {
          image: `${BASE}projects/rdv-sante-technique.jpg`,
          titre: 'Le projet explique son propre fonctionnement',
          texte:
            'L’application embarque une visite guidée et un écran qui raconte, sans jargon, ce qui a été difficile : deux personnes qui réservent la même seconde, un rappel qui se perd, un message envoyé deux fois. Y compris une erreur que j’ai commise et la façon dont je l’ai trouvée.',
        },
      ],
    },
  },
  {
    name: 'Factura',
    tagline: 'Facturation conforme au Maroc, sans trou de numérotation',
    description:
      'Une très petite entreprise marocaine facture encore sous Word ou Excel. Trois choses finissent toujours par arriver : on saute un numéro, on oublie une mention obligatoire, on ne sait plus qui n’a pas payé. Les deux premières coûtent cher lors d’un contrôle fiscal. Ici, la base de données elle-même refuse de créer deux factures au même numéro, de réécrire une facture émise ou d’encaisser plus que le montant dû — et les relances partent toutes seules, jamais deux fois.',
    tech: ['PHP 8.4', 'Laravel 13', 'Vue 3', 'Inertia', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'PHPUnit'],
    demoUrl: 'https://factura-eu.onrender.com',
    demoEveil: true,
    codeUrl: 'https://github.com/diffonathan/factura',
    image: `${BASE}projects/factura.jpg`,
    accentColor: 'warning',
    privateSource: false,
    demo: {
      etapes: [
        {
          image: `${BASE}projects/factura.jpg`,
          titre: 'Ce qui est rentré, ce qui manque',
          texte:
            'Quatre chiffres et trois couleurs qui ne changent jamais de sens : le vert est l’argent encaissé, le rouge ce qui a dépassé son échéance, le gris ce qu’on attend sans inquiétude. L’or est réservé à ce sur quoi on clique — un montant n’est donc jamais doré.',
        },
        {
          image: `${BASE}projects/factura-creation.jpg`,
          titre: 'Là où l’on fabrique une facture',
          texte:
            'Deux lignes, deux unités, la TVA et la remise ligne par ligne. Le total affiché est calculé exactement comme la base le fera — arrondi au centime à chaque ligne, puis sommé — pour qu’aucun écart n’apparaisse après l’enregistrement. Les deux boutons disent la seule différence qui compte : un brouillon se modifie, une émission attribue le numéro légal et fige tout.',
        },
        {
          image: `${BASE}projects/factura-document.jpg`,
          titre: 'Une facture, telle qu’elle sera remise',
          texte:
            'Mentions légales de l’émetteur et du client, TVA ventilée par taux, reste dû et historique des règlements. Une fois émise, elle est figée : on la corrige par un avoir, jamais en la réécrivant. C’est la loi, et c’est ce qu’un contrôleur vérifie en premier.',
        },
        {
          image: `${BASE}projects/factura-visite.jpg`,
          titre: 'L’application explique son propre métier',
          texte:
            'Une visite guidée en sept étapes s’ouvre à la première venue. Elle commence par le problème — pourquoi un tableur ne peut pas tenir une numérotation légale — puis montre les écrans, et finit par les technologies employées. Sans jargon : le lecteur visé n’est pas développeur.',
        },
      ],
    },
  },
  {
    name: 'ConfluenceTerminal',
    tagline: 'Terminal d’analyse fondamentale de niveau institutionnel',
    description:
      'Verdict directionnel sur 67 actifs et 3 horizons, croisant macro (FRED), positionnement institutionnel (COT/CFTC), énergie (EIA), géopolitique (GDELT) et backtest historique. Comptes, essai de 30 jours et abonnement Stripe ; alertes Telegram avant les publications à fort impact.',
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
      'Journal complet pour traders : import CSV MT4/MT5, statistiques et courbes d’équité, calendrier, carnet de notes et export PDF, et un coach IA qui analyse les trades pour identifier les schémas récurrents.',
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
    demoUrl: '',
    internalTool: true,
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
    demoUrl: '',
    internalTool: true,
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
    tagline: 'Site corporate d’une ESN — WordPress sur-mesure',
    description:
      'Site vitrine d’une ESN (Cloud, Cybersécurité, Data & IA) : arborescence, gabarits Elementor sur-mesure, formulaires de contact et optimisation du chargement. Conçu pour être repris et enrichi par l’équipe sans développeur.',
    tech: ['WordPress', 'Elementor Pro', 'Thème sur-mesure', 'Contact Form 7', 'SEO'],
    demoUrl: 'https://mboservices.tech',
    image: `${BASE}projects/mbo-services.jpg`,
    accentColor: 'info',
    privateSource: true,
  },
  {
    name: 'M2CG Ingénierie',
    tagline: 'Site corporate — ingénierie nucléaire et industrielle',
    description:
      'Site vitrine d’un bureau d’ingénierie intervenant dans le nucléaire, l’énergie et l’industrie : pôles d’expertise, processus d’intervention, espace carrières et contact. Gabarits Elementor sur-mesure, identité visuelle forte et parcours pensé pour la prise de contact.',
    tech: ['WordPress', 'Elementor Pro', 'Thème sur-mesure', 'Contact Form 7', 'SEO'],
    // ⚠️ URL TEMPORAIRE d'aperçu Hostinger : elle cessera de répondre quand le
    // domaine définitif (m2cg-ing.com, déjà utilisé pour leurs e-mails) sera
    // branché. À remplacer à ce moment-là, sinon le lien casse.
    demoUrl: 'https://lightgreen-sandpiper-369560.hostingersite.com',
    image: `${BASE}projects/m2cg.jpg`,
    accentColor: 'warning',
    privateSource: true,
  },
]

export const projectsSection = {
  title: 'Projets phares',
  subtitle:
    'Une sélection de produits conçus, développés et mis en production de bout en bout.',
  // « — accès sur demande » retiré : le code de ces produits reste privé, il
  // appartient à leurs commanditaires. Promettre un accès qu'on ne peut pas
  // donner crée une attente qu'il faudra décevoir.
  privateNote: 'Code source privé',
  codeLabel: 'Code source',
  internalNote: 'Outil interne — non ouvert au public',
  demoLabel: 'Démo live',
  demoEveilNote: 'Hébergement gratuit : la première ouverture prend environ une minute, le temps que le serveur se réveille.',
}

/* ----------------------------- Services --------------------------------- */

export const services: Service[] = [
  {
    title: 'Digitalisation de processus métier',
    description:
      'Vos fichiers Excel, vos modèles Word et vos allers-retours par e-mail deviennent une application : une seule saisie, des étapes verrouillées, les documents générés et un suivi partagé. Je conserve le format que l’équipe connaît pour que la bascule ne lui coûte rien.',
    icon: Workflow,
  },
  {
    title: 'Applications web métier sur-mesure',
    description:
      'De l’architecture à la mise en production : base de données, API, interface, comptes et droits d’accès. TypeScript strict, tests et performance au rendez-vous.',
    icon: Code2,
  },
  {
    title: 'Création de SaaS (MVP → production)',
    description:
      'Du prototype validé au produit qui encaisse : authentification, abonnements Stripe, espace membres, infrastructure serverless à coût maîtrisé.',
    icon: Rocket,
  },
  {
    title: 'Applications mobiles Android & iOS',
    description:
      'Une seule base de code Flutter pour les deux plateformes, ou du natif Kotlin quand le projet l’exige : notifications push, usage hors-ligne, connexion à vos services existants et publication sur les stores.',
    icon: Smartphone,
  },
  {
    title: 'Sites vitrines, landing pages & e-commerce',
    description:
      'Sites de présentation, pages d’atterrissage orientées conversion et boutiques en ligne (WooCommerce, paiement Stripe) : design soigné, SEO, chargement rapide, et une administration que vous reprenez sans développeur.',
    icon: ShoppingCart,
  },
  {
    title: 'Agents IA & automatisations',
    description:
      'Agents IA intégrés à vos outils (Groq, Claude, OpenAI) : analyse de documents, assistants métier, workflows automatisés qui font gagner des heures.',
    icon: Bot,
  },
]

export const servicesSection = {
  title: 'Services',
  subtitle:
    'Site vitrine, boutique en ligne, SaaS, application métier, application mobile ou processus interne à digitaliser : je prends le projet de la première maquette à la mise en production.',
}

/* ---------------------------- Expérience -------------------------------- */

/**
 * Trois périodes qui s’enchaînent, sans chevauchement.
 *
 * Les dates précédentes (« Indépendant 2024 — Aujourd’hui » et « MBO Services
 * 2023 — Aujourd’hui ») se recouvraient sur deux ans et se contredisaient : la
 * chronologie réelle est IAWEB.DEV, puis la prestation Hope Traders Academy,
 * puis MBO Services. Doit rester alignée sur src/data/cv.json.
 */
export const experience: ExperienceItem[] = [
  {
    role: 'Développeur Full Stack',
    company: 'MBO Services — Consulting IT',
    period: 'avril — septembre 2026',
    missions: [
      'Digitalisation de deux processus internes qui reposaient sur des fichiers Excel et des modèles Word : la réponse aux appels d’offres et le recrutement. Les deux applications sont en service.',
      'Sur un appel d’offres, l’outil retrouve la date limite et le périmètre dans des dossiers de centaines de pages, et montre le passage exact d’où il les tire.',
      'Côté RH, le suivi reprend les colonnes exactes du tableur qu’il remplace et s’exporte au même format : l’équipe a basculé sans changer ses habitudes.',
      'Refonte du site corporate et livraison d’un site client, conçus pour être mis à jour sans développeur.',
    ],
  },
  {
    role: 'Développeur Full Stack indépendant',
    company: 'Hope Traders Academy — prestation',
    period: '2026',
    missions: [
      'Trois produits web livrés de bout en bout, chacun avec son site de présentation et son application.',
      'Plateforme de formation et d’espace membres : inscription, abonnement, cours débloqués progressivement, messagerie et administration.',
      'Journal de suivi d’activité et terminal d’analyse de marché, exploités directement par le client.',
    ],
  },
  {
    role: 'Développeur Web Full Stack',
    company: 'IAWEB.DEV',
    period: '2023 — 2025',
    missions: [
      'Applications web sur mesure pour Bailey Assurances, CRFPE et Interloc : développement complet, de l’interface à la base de données.',
      'Sites vitrines et boutiques en ligne, à partir de maquettes fournies par les équipes design.',
      'Travail en équipe avec les pôles design et marketing, en méthode agile.',
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

/** Affiché sous les coordonnées : recruteurs et clients n'ont pas les mêmes
    questions, et la réponse tient en trois lignes. */
export const disponibilite = {
  title: 'Travailler ensemble',
  items: [
    {
      label: 'Freelance',
      detail: 'Mission au forfait ou en régie, de la conception à la mise en production.',
    },
    {
      label: 'En entreprise, à distance',
      detail:
        'Ma préférence : poste entièrement équipé chez moi, disponible sur vos outils et vos rituels d’équipe.',
    },
    {
      label: 'Sur site',
      detail: 'Possible, en particulier pour les phases de cadrage et les points d’équipe.',
    },
  ] as Modalite[],
}

export const socials: SocialLink[] = [
  {
    label: 'Email',
    url: `mailto:${identity.email}`,
    icon: Mail,
  },
  {
    label: 'Téléphone',
    url: `tel:${identity.telephone}`,
    icon: Phone,
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

/* -------------------- Métadonnées & libellés d'interface ----------------- */

/** Réécrites à chaud à chaque bascule de langue (voir src/i18n.tsx). */
export const meta = {
  htmlLang: 'fr',
  ogLocale: 'fr_FR',
  title: 'Nathan Princer Diffo — Développeur Full Stack, digitalisation des processus',
  description:
    'Développeur Full Stack à Marrakech. Je transforme des processus qui vivent dans des fichiers Excel et des modèles Word en applications que les équipes utilisent tous les jours — de l’interface au serveur, paiement et mise en ligne compris.',
  descriptionCourte:
    'Je transforme des processus qui vivent dans Excel et Word en applications que les équipes utilisent tous les jours.',
}

/** Tout ce qui n'est pas du contenu éditorial : libellés de boutons, textes
    alternatifs, messages d'état. Les fonctions servent aux phrases à trou —
    l'ordre des mots change d'une langue à l'autre, une concaténation dans le
    composant ne se traduirait pas. */
export const ui = {
  skipLink: 'Aller au contenu principal',
  navAriaLabel: 'Navigation principale',
  menuOuvrir: 'Ouvrir le menu',
  menuFermer: 'Fermer le menu',
  langueLabel: 'Choisir la langue du site',
  langueNom: { fr: 'Français', en: 'Anglais' } as Record<'fr' | 'en', string>,
  portraitAlt: (nom: string) => `Portrait de ${nom}`,
  captureAlt: (projet: string) => `Capture d’écran de ${projet}`,
  apercuAlt: (projet: string) => `Aperçu à venir pour ${projet}`,
  voirDemo: 'Voir la démo guidée',
  demoTitre: 'Démo guidée',
  demoAria: (projet: string) => `Démo guidée — ${projet}`,
  demoFermerAria: 'Fermer la démo',
  fermer: 'Fermer',
  etape: (n: number, total: number) => `Étape ${n} / ${total}`,
  precedent: 'Précédent',
  suivant: 'Suivant',
  terminer: 'Terminer',
  demoAvertissementAvant:
    'Captures d’une instance de démonstration — clients, candidats et dossiers sont',
  demoAvertissementFort: ' entièrement fictifs',
  demoAvertissementApres:
    '. L’outil en production traite des données confidentielles et n’est pas ouvert au public.',
  mailSujet: (nom: string) => `Contact portfolio — ${nom}`,
}
