/* ============================================================================
   ENGLISH CONTENT — twin of portfolio.ts
   ----------------------------------------------------------------------------
   Same exports, same keys: TypeScript refuses to compile if this file drifts
   from the French one (see src/i18n.tsx). Only the TEXT differs — icons,
   colours, image paths, URLs, figures and technology names stay identical.
   Types are imported rather than redeclared, so there is one definition only.
============================================================================ */

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
import type {
  ExperienceItem,
  Modalite,
  Project,
  Service,
  SocialLink,
  Stat,
  StackCategory,
} from './portfolio'

const BASE = import.meta.env.BASE_URL

/* --------------------------- Identity ---------------------------------- */

export const identity = {
  name: 'Nathan Princer Diffo',
  initials: 'NPD',
  baseline: 'Full Stack Developer · Business Process Digitalisation',
  location: 'Marrakech, Morocco',
  telephone: '+212660179871',
  telephoneAffiche: '+212 660 179 871',
  email: 'diffoprincer@gmail.com',
  availabilityBadge: 'Available — freelance or employed; on site, hybrid or remote',
  // Mirrored on purpose: in English the primary download is the English CV,
  // and the secondary link points back to the French one.
  cvUrl: `${BASE}cv-en.pdf`,
  cvUrlEn: `${BASE}cv.pdf`,
}

/* ----------------------------- Hero ------------------------------------ */

export const hero = {
  subtitle:
    'I turn processes that live in spreadsheets and Word templates into applications ' +
    'teams actually use every day — from the interface to the server, payment and ' +
    'go-live included.',
  ctaPrimary: 'See my work',
  ctaSecondary: 'Download my CV',
  cvEnPrefix: 'CV also available ',
  cvEnLabel: 'in French',
}

/* --------------------------- Navigation --------------------------------- */

export const navLinks = [
  { label: 'Home', href: '#accueil' },
  { label: 'Work', href: '#projets' },
  { label: 'Stack', href: '#stack' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
]

export const navCta = { label: 'Get in touch', href: '#contact' }

/* ----------------------------- About ------------------------------------ */

export const about = {
  title: 'About',
  bio: [
    'I design and ship applications end to end: the interface, the server, the database, payment, go-live — and making sure the people who use it can actually pick it up.',
    'What I do most often: replace processes that live in spreadsheets and Word templates with a tool the team adopts. An internal tool rarely fails on the technical side — it fails because nobody opens it. That is the part of this job that interests me.',
  ],
  photoUrl: `${BASE}profile.jpg`,
  avatarUrl: `${BASE}avatar.png`,
}

export const stats: Stat[] = [
  { value: 3, suffix: '+', label: 'Years of experience' },
  { value: 10, suffix: '+', label: 'Projects shipped' },
  { value: 4, suffix: '', label: 'SaaS products built' },
]

/* --------------------------- Tech stack --------------------------------- */

export const stackSection = {
  title: 'Tech stack',
  subtitle: 'The technologies I design, build and ship with.',
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
    title: 'Artificial Intelligence',
    icon: Sparkles,
    items: ['AI agent design', 'LLM integration', 'Groq / Claude / OpenAI', 'Automation'],
  },
  {
    title: 'Web & growth',
    icon: Megaphone,
    items: ['WordPress / Elementor', 'WooCommerce', 'Systeme.io', 'Sales funnels', 'Envato'],
  },
  {
    title: 'Tools',
    icon: Wrench,
    items: ['Git / GitHub', 'GitHub Actions', 'Docker / Caddy', 'Cloudflare Pages', 'Figma'],
  },
]

/* ------------------------------ Work ------------------------------------ */

export const projects: Project[] = [
  {
    name: 'Tasswiya',
    tagline: 'Bounced-cheque deadlines, and the rule that stops them',
    description:
      'A cheque bounces, and five deadlines start running at once: presentation for payment, the bank penalty, the thirty days to settle and avoid prosecution, the right to issue cheques at all, the banking ban. Creditors, debtors and lawyers track them in a notebook, and one missed date sends everyone back to the criminal courts that the 2026 reform was meant to spare them. Tasswiya keeps these clocks, says which one is running, and refuses an action when a rule of law stands in the way — naming the article and quoting the Arabic text, the only version with legal force. The law was read before any of it was coded: the official gazette contradicted three claims in the brief, and the text won. This is not legal advice — the data is fictional, and the warning sits on every screen.',
    tech: ['PHP 8.3', 'Symfony 7.2', 'Symfony Workflow', 'Doctrine ORM', 'PostgreSQL 16', 'Twig', 'Docker', 'PHPUnit'],
    // Not live yet: the hosting still has to be opened, and we do not publish
    // an address that would answer 404. The public repository does not exist
    // either, hence an empty `codeUrl` rather than a link to something
    // nobody can read.
    demoUrl: '',
    codeUrl: 'https://github.com/diffonathan/tasswiya',
    // ⚠️ The cover is NOT tasswiya.jpg, and that is a measured judgement call,
    // not an oversight. The card renders the image as `aspect-video …
    // object-cover` (see Projects.tsx): anything outside the central 16:9 is
    // cropped away. Simulating that crop on each candidate, what survives is:
    //   tasswiya.jpg        1840 × 3240 →  32% of the height
    //   tasswiya-degres.jpg 1840 × 1690 →  61% of the height
    //   tasswiya-avant.jpg  1840 × 1662 →  62% of the height
    //   tasswiya-regle.jpg  1840 × 1022 →  99% of the WIDTH
    // On tasswiya.jpg the counter disappears, and that is half of what the
    // image promises; on tasswiya-avant.jpg the crop takes both the "1 day
    // left" counter at the top and two of the four struck-through transitions
    // at the bottom — the two things that capture exists to show.
    // tasswiya-regle.jpg sits at 0.555, which is already 16:9: it goes through
    // whole, and it carries the project's single argument (what the law opens,
    // then what this software allows) while showing two of the certainty
    // borders along the way. The others stay visible in full inside the guided
    // tour, where the modal puts no constraint on the ratio.
    image: `${BASE}projects/tasswiya-regle.jpg`,
    accentColor: 'accent',
    privateSource: true,
    demo: {
      etapes: [
        {
          image: `${BASE}projects/tasswiya-avant.jpg`,
          titre: 'At twenty-nine days, no door opens',
          texte:
            'The tutorial puts the clock and the state graph in the same frame, so both can be read in one look. On the left, H3 reads “1 day left” and names where it starts from: the date of the écédar — the police summons that must precede prosecution — and nothing else. On the right, the case has not moved, and the four transitions leading out of its state are struck through, each with the rule that refuses it, its Arabic wording, its article and a pointer to the paragraph of the law write-up. Nothing has been entered, no button has been pressed.',
        },
        {
          image: `${BASE}projects/tasswiya-apres.jpg`,
          titre: 'At thirty-one, one opens — and nobody can push it',
          texte:
            'Same frame, to the pixel: same coordinates, same width, same height. The only new fact is the passing of time. The clock is now one day past its deadline, the case moves from “écédar served” to “deadline expired”, and one transition has opened in the graph: expire the deadline, marked BY TIME. It is precisely the one no user can trigger — it belongs to the calendar, not to the interface. A second graph shows what that expiry opens in turn: start the prosecution. Four closed transitions, then exactly one open: those are the only two numbers these captures pin down, and the script that produces them fails if either changes.',
        },
        {
          image: `${BASE}projects/tasswiya-regle.jpg`,
          titre: 'What the law opens, and what this software allows',
          texte:
            'The brief claimed the extension may only be granted once. The official text says the opposite: art. 325 §8 opens “لمدة مماثلة أو أكثر” — a period equal to or longer than the first — without capping how many times. The product does apply a quota, but it shows it second, in a dotted border, labelled THIS SOFTWARE’S CHOICE, and never as a rule of law; the capture script refuses to write the image if that choice came before the legal rule. Two other claims fell the same way: the thirty days run from the écédar — a formal notice served by a judicial police officer — and not from the cheque being refused; and the “2% against 25%” was comparing a bank penalty with the floor of a criminal fine, which only arrives after conviction. Every rule in the project is written down with its source and its degree of certainty.',
        },
        {
          image: `${BASE}projects/tasswiya.jpg`,
          titre: 'Five clocks, five different starting points',
          texte:
            'One case, five countdowns, and that is the whole problem. The “starts from” column does not give a label but the dated fact each clock derives from: the issue date, the bank injunction, the écédar, the deadline of the first clock, the payment incident. Because the facts are distinct, the deadlines never land together — and a notebook loses them. The durations readable here come from the fictional dataset and will move the next time the fixtures are loaded; what will not move is that nothing in the code reads the machine clock. The one way the present enters the system is an injected clock, and the proof is experimental: push it a hundred days and every counter shifts by exactly −100.',
        },
        {
          image: `${BASE}projects/tasswiya-degres.jpg`,
          titre: 'Degree of certainty, readable without colour',
          texte:
            'Four degrees — established, probable, uncertain, this software’s choice — and it is the BORDER that carries them: solid, double, dashed, dotted. Not the hue. First because `border-style` is the only property on that list a browser always prints, so the only one that survives a printed or photocopied page. Second because a reader who cannot tell two colours apart must still be able to tell what comes from the official gazette from what we decided ourselves. The design plate shows the column in colour and then the same column in greyscale: the second is the test, not the illustration. No screen in the product puts all four degrees side by side — only this plate does.',
        },
      ],
    },
  },
  {
    name: 'Mizan',
    tagline: 'Answer on Moroccan labour law, or decline to answer',
    description:
      'A Moroccan employee wondering what they are entitled to lands on a forum, on a three-hundred-page PDF, or on an AI that hands them an article number which does not exist. What is missing is not an answer: it is an answer whose source you can check, and a system that declines to answer when it does not know rather than producing a plausible-looking article. Mizan reads the 589 articles of the Labour Code, answers only when it has actually found the texts, and rejects outright any draft citing an article that is not in what it retrieved — 31 fabrications planted for the test, 31 stopped. Nothing is claimed here that a command in the repository does not print again.',
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
          titre: 'Declining to answer is an answer',
          texte:
            '“How do I declare my rental income?” has no answer in the Labour Code. Mizan writes nothing at all, and the model is never even called — you cannot invent what was never asked for. The screen says why: the closest article tops out at 0.27 similarity against a 0.46 threshold, and it names the words the Code never uses. The near-miss texts stay on screen, but labelled CANDIDATE, not CITED. Of the 36 questions in the set that have no answer in the Code, 27 get this silence.',
        },
        {
          image: `${BASE}projects/mizan-tutoriel.jpg`,
          titre: 'The citation guard, caught in the act',
          texte:
            'It is the one real guarantee in the project, and it is invisible as long as nothing goes wrong — so the tutorial stages it. The writer is made to cite three articles: 269 and 270, genuinely retrieved, and 1098, which exists in ANOTHER code. The whole answer is rejected. This is not a probability filter but set membership, shown in the open: citations read {269, 270, 1098}, articles retrieved {269, 270, 154, 13, 219}, inclusion broken by 1098. An answer that is half invented does not get patched up.',
        },
        {
          image: `${BASE}projects/mizan-article.jpg`,
          titre: 'An article without its chapter does not say the same thing',
          texte:
            'Article 231 comes with its exact place in the Code: Book II — working conditions and pay, Title III — working hours, Chapter IV — paid annual leave, Section I. In law it is that hierarchy which says who the text applies to, and an answer that strips it away can no longer be checked. The card also names which search arm found the article and the page of the official PDF, so you can verify it somewhere other than inside this application.',
        },
        {
          image: `${BASE}projects/mizan.jpg`,
          titre: 'What the project says against itself',
          texte:
            'Two banners are there before you have asked anything. The corpus is consolidated as of 26 October 2011: that is not the law as it stands today, and no case law is included. And with no model key, the drafting on screen is a stand-in — the RETRIEVAL of the articles is real, and that is what has been measured. The write-up names its own biggest hole: the guard checks provenance, not relevance, so a genuine article cited in the wrong place still gets through.',
        },
      ],
    },
  },
  {
    name: 'Artisans.ma',
    tagline: 'Find a tradesperson who will actually come to you',
    description:
      'Getting a plumber to your home in Morocco means calling a number copied onto a scrap of paper, then a second, then a third. You never know which one will travel to your address, nor what they will charge until you hang up. So the search does not show the nearest tradespeople — it shows the ones whose own travel radius covers the job: a painter 168 km away in Essaouira shows up, a carpenter 30 km away who never leaves his valley does not. And a review only exists if the job was paid for and then marked complete.',
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
          titre: 'The question is not “who is nearest”',
          texte:
            'Every tradesperson declares THEIR OWN travel radius, and that is what decides. The painter from Essaouira travels 200 km, so he appears for a job in Marrakech 168 km away. The carpenter in Tahannaout, 30 km from the same job, does not — his radius stops at 10 km. A single distance threshold cannot produce that: set to 30 km it keeps the wrong one, set to 200 km it keeps both.',
        },
        {
          image: `${BASE}projects/artisans-devis.jpg`,
          titre: 'Compare, then commit',
          texte:
            'The client describes the job once; tradespeople in range reply with a price, a lead time and what they intend to do. Accepting one automatically declines the others and freezes the amount onto the booking — if the quote is edited afterwards, the agreement does not move. The screen says what the click will do before you click it.',
        },
        {
          image: `${BASE}projects/artisans-chantiers.jpg`,
          titre: 'What the tradesperson sees, and what they do not',
          texte:
            'Jobs within their radius, with the distance and the client’s first name — never the exact address or phone number. Those arrive with the booking, once the quote has been accepted. This is not an access check bolted on top: the address is copied onto the booking, so it simply is not where they should not be reading it.',
        },
        {
          image: `${BASE}projects/artisans-technique.jpg`,
          titre: 'What the database cannot guarantee, said plainly',
          texte:
            'MongoDB has no foreign keys: nothing stops it accepting a review that matches no job at all. Rather than claim that is impossible, the application says so, replaces it with three verifiable mechanisms, and watches the rest with an integrity command. The technical page walks through the reasoning, the measurements, and the bugs found along the way.',
        },
      ],
    },
  },
  {
    name: 'RDV Santé',
    tagline: 'Appointment booking and a live waiting queue',
    description:
      'In Morocco you still book by phone, then sit in a waiting room with no idea how many people are ahead of you. Here the patient books online and follows their position from their phone, while the front desk runs the day from a single screen. Four independent services that never call each other directly: they exchange events, so if one goes down the others carry on.',
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
          titre: 'Booking takes three moves',
          texte:
            'A clinic, a practitioner, a slot — then three fields. Times already taken are never offered, and two patients aiming at the same one cannot both succeed: a partial unique index forbids it inside the database, not a check in the code. The banner says plainly that everything is fictional — a health application is not demonstrated on real data.',
        },
        {
          image: `${BASE}projects/rdv-sante.jpg`,
          titre: 'The waiting-room screen',
          texte:
            'Built for a television on the wall, read standing up from three metres away: one piece of information that matters — who is being called — and the next few below it. It updates the moment the front desk acts, with no reload and without anyone touching it.',
        },
        {
          image: `${BASE}projects/rdv-sante-secretariat.jpg`,
          titre: 'The front desk, on one screen',
          texte:
            'Expected appointments on the right, the queue on the left. Marking an arrival puts the patient in the queue; “call next” moves them through to the consultation. Position is never typed in — it is derived from arrival time, so it cannot drift out of sync.',
        },
        {
          image: `${BASE}projects/rdv-sante-technique.jpg`,
          titre: 'The project explains itself',
          texte:
            'The application ships with a guided tour and a screen that explains, in plain words, what was hard: two people booking the same second, a reminder going missing, a message sent twice. Including a mistake I made and how I found it.',
        },
      ],
    },
  },
  {
    name: 'Factura',
    tagline: 'Morocco-compliant invoicing, with no gaps in the numbering',
    description:
      'Moroccan micro-businesses still invoice in Word or Excel. Three things always end up happening: a number gets skipped, a mandatory legal mention is forgotten, and nobody knows who has not paid. The first two are expensive during a tax audit. Here the database itself refuses to create two invoices with the same number, to rewrite an issued invoice, or to record a payment larger than the amount due — and dunning letters go out on their own, never twice.',
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
          titre: 'What came in, and what is missing',
          texte:
            'Four figures and three colours whose meaning never changes: green is cash actually received, red is past its due date, grey is what we are still waiting for without concern. Gold is reserved for things you click — so an amount is never gold.',
        },
        {
          image: `${BASE}projects/factura-creation.jpg`,
          titre: 'Where an invoice is actually made',
          texte:
            'Two lines, two units, VAT and discount per line. The total on screen is computed exactly as the database will compute it — rounded to the centime line by line, then summed — so nothing shifts once it is saved. The two buttons state the only distinction that matters: a draft can still be edited, while issuing assigns the legal number and freezes everything.',
        },
        {
          image: `${BASE}projects/factura-document.jpg`,
          titre: 'An invoice, exactly as it will be handed over',
          texte:
            'Legal identifiers for both issuer and client, VAT broken down by rate, balance due and payment history. Once issued it is frozen: you correct it with a credit note, never by rewriting it. That is the law, and it is the first thing an auditor checks.',
        },
        {
          image: `${BASE}projects/factura-visite.jpg`,
          titre: 'The application explains its own trade',
          texte:
            'A seven-step guided tour opens on the first visit. It starts with the problem — why a spreadsheet cannot hold a legal numbering series — then walks through the screens and ends with the technologies used. No jargon: the intended reader is not a developer.',
        },
      ],
    },
  },
  {
    name: 'ConfluenceTerminal',
    tagline: 'Institutional-grade fundamental analysis terminal',
    description:
      'A directional verdict on 67 assets across 3 horizons, cross-referencing macro data (FRED), institutional positioning (COT/CFTC), energy (EIA), geopolitics (GDELT) and historical backtesting. Accounts, a 30-day trial and Stripe subscriptions; Telegram alerts ahead of high-impact releases.',
    tech: ['React', 'TypeScript', 'Tailwind', 'Cloudflare Workers', 'D1', 'Stripe', 'Groq', 'TradingView'],
    demoUrl: 'https://confluenceterminal.hopetraders.fr',
    image: `${BASE}projects/confluenceterminal.jpg`,
    accentColor: 'info',
    privateSource: true,
  },
  {
    name: 'Hope Traders Academy',
    tagline: 'Trading education and signals platform',
    description:
      'A full membership area: live signals with push notifications, a 72-video course unlocked in stages, a weekly webinar, messaging with the team, call booking, an admin area and a certificate. Three Stripe payment plans, installable as an app (PWA).',
    tech: ['React', 'TypeScript', 'Cloudflare Pages', 'Workers', 'D1 / KV', 'Stripe', 'PWA'],
    demoUrl: 'https://vip.hopetraders.fr',
    image: `${BASE}projects/hopetraders.jpg`,
    accentColor: 'warning',
    privateSource: true,
  },
  {
    name: 'HopeJournal',
    tagline: 'Trading journal with an AI coach',
    description:
      'A complete journal for traders: MT4/MT5 CSV import, statistics and equity curves, calendar, notebook and PDF export, plus an AI coach that reviews trades to surface recurring patterns.',
    tech: ['React', 'TypeScript', 'Supabase', 'Groq', 'Recharts'],
    demoUrl: 'https://hopejournal.hopetraders.fr',
    image: `${BASE}projects/hopejournal-site.jpg`,
    accentColor: 'accent',
    privateSource: true,
  },
  {
    name: 'Project Tracker',
    tagline: 'AI-assisted tender response pipeline',
    description:
      'A business application that industrialises tender responses: automatic extraction of deadlines and scope of supply from the documents, a locked 9-stage workflow, a technical review produced by an LLM as a background job, document generation and duplicate detection.',
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
          titre: 'Steering: where every bid stands',
          texte:
            'The dashboard aggregates open tenders: volume handled, conversion rate, committed amounts and breakdown by status. Filters by year and month make it possible to compare two periods without leaving the page.',
        },
        {
          image: `${BASE}demo/tracker-projets.jpg`,
          titre: 'A locked, nine-stage workflow',
          texte:
            'Every bid follows an enforced path, from the NDA through to invoicing. A stage only opens once the previous one is closed: that is what stops a bid going out without a technical review or a mandatory document.',
        },
        {
          image: `${BASE}demo/tracker-documentation.jpg`,
          titre: 'The documentation lives inside the tool',
          texte:
            'Every screen carries its own instructions and a first-run walkthrough. The tool is used by non-technical people: it had to be usable without training.',
        },
      ],
    },
  },
  {
    name: 'Recruitment application',
    tagline: 'HR management wired into Microsoft 365',
    description:
      'A standalone recruitment tool: candidate tracking, generation of eight contractual documents from templates, HR trigram identifiers, GDPR compliance and SharePoint / Microsoft 365 integration. Deployed on a VPS in containers.',
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
          titre: 'From request to open role, in one entry',
          texte:
            'The tool reads the email stating the hiring need (or pasted text), pre-fills the role description, then numbers the file, creates its folder structure and generates the requirement form and the job advert in Word and PDF.',
        },
        {
          image: `${BASE}demo/rh-recrutement.jpg`,
          titre: 'The candidate journey, stage by stage',
          texte:
            'Each candidate moves through a pipeline whose current stage physically files their CV in the right sub-folder. The HR trigram is derived from the name and serves as the identifier throughout the process.',
        },
        {
          image: `${BASE}demo/rh-suivi.jpg`,
          titre: 'Tracking that replaces the spreadsheet',
          texte:
            'The tracking table uses the exact columns of the spreadsheet it replaces — and exports to the same format. The switch was designed to impose nothing new on the HR team. A GDPR purge is built in.',
        },
      ],
    },
  },
  {
    name: 'MBO Services',
    tagline: 'IT services company website — custom WordPress',
    description:
      'Corporate site for an IT services company (Cloud, Cybersecurity, Data & AI): information architecture, custom Elementor templates, contact forms and load-time optimisation. Built so the team can maintain and extend it without a developer.',
    tech: ['WordPress', 'Elementor Pro', 'Custom theme', 'Contact Form 7', 'SEO'],
    demoUrl: 'https://mboservices.tech',
    image: `${BASE}projects/mbo-services.jpg`,
    accentColor: 'info',
    privateSource: true,
  },
  {
    name: 'M2CG Ingénierie',
    tagline: 'Corporate site — nuclear and industrial engineering',
    description:
      'Corporate site for an engineering firm working in nuclear, energy and industry: areas of expertise, intervention process, careers area and contact. Custom Elementor templates, a strong visual identity and a journey built to generate enquiries.',
    tech: ['WordPress', 'Elementor Pro', 'Custom theme', 'Contact Form 7', 'SEO'],
    demoUrl: 'https://lightgreen-sandpiper-369560.hostingersite.com',
    image: `${BASE}projects/m2cg.jpg`,
    accentColor: 'warning',
    privateSource: true,
  },
]

export const projectsSection = {
  title: 'Selected work',
  subtitle: 'A selection of products designed, built and shipped end to end.',
  privateNote: 'Private source code',
  codeLabel: 'Source code',
  internalNote: 'Internal tool — not open to the public',
  demoLabel: 'Live demo',
  demoEveilNote: 'Free hosting: the first visit takes about a minute while the server wakes up.',
}

/* ----------------------------- Services --------------------------------- */

export const services: Service[] = [
  {
    title: 'Business process digitalisation',
    description:
      'Your spreadsheets, Word templates and email ping-pong become one application: entered once, stages locked, documents generated and tracking shared. I keep the format the team already knows so the switch costs them nothing.',
    icon: Workflow,
  },
  {
    title: 'Custom business web applications',
    description:
      'From architecture to go-live: database, API, interface, accounts and access rights. Strict TypeScript, tests and performance throughout.',
    icon: Code2,
  },
  {
    title: 'SaaS products (MVP → production)',
    description:
      'From a validated prototype to a product that takes payment: authentication, Stripe subscriptions, membership area, serverless infrastructure at a controlled cost.',
    icon: Rocket,
  },
  {
    title: 'Android & iOS mobile apps',
    description:
      'A single Flutter codebase for both platforms, or native Kotlin when the project calls for it: push notifications, offline use, connection to your existing services and publication to the stores.',
    icon: Smartphone,
  },
  {
    title: 'Brochure sites, landing pages & e-commerce',
    description:
      'Brochure sites, conversion-focused landing pages and online stores (WooCommerce, Stripe payments): careful design, SEO, fast loading, and an admin you take over without a developer.',
    icon: ShoppingCart,
  },
  {
    title: 'AI agents & automation',
    description:
      'AI agents wired into your tools (Groq, Claude, OpenAI): document analysis, business assistants, automated workflows that save hours.',
    icon: Bot,
  },
]

export const servicesSection = {
  title: 'Services',
  subtitle:
    'A brochure site, an online store, a SaaS product, a business application, a mobile app or an internal process to digitalise: I take the project from the first mockup to production.',
}

/* ---------------------------- Experience -------------------------------- */

export const experience: ExperienceItem[] = [
  {
    role: 'Full Stack Developer',
    company: 'MBO Services — IT Consulting',
    period: 'April — September 2026',
    missions: [
      'Digitalised two internal processes that ran on spreadsheets and Word templates: tender responses and recruitment. Both applications are in service.',
      'On a tender, the tool finds the deadline and the scope of supply inside files running to hundreds of pages, and shows the exact passage it took them from.',
      'On the HR side, the tracker uses the exact columns of the spreadsheet it replaces and exports to the same format: the team switched without changing its habits.',
      'Rebuilt the corporate website and delivered a client site, both designed to be updated without a developer.',
    ],
  },
  {
    role: 'Freelance Full Stack Developer',
    company: 'Hope Traders Academy — contract work',
    period: '2026',
    missions: [
      'Three web products delivered end to end, each with its own marketing site and its application.',
      'Training and membership platform: sign-up, subscription, courses unlocked in stages, messaging and administration.',
      'Activity journal and market analysis terminal, both run directly by the client.',
    ],
  },
  {
    role: 'Full Stack Web Developer',
    company: 'IAWEB.DEV',
    period: '2023 — 2025',
    missions: [
      'Custom web applications for Bailey Assurances, CRFPE and Interloc: full development, from interface to database.',
      'Brochure sites and online stores, built from designs supplied by the design teams.',
      'Worked alongside the design and marketing teams in an agile setup.',
    ],
  },
]

export const experienceSection = {
  title: 'Experience',
  subtitle: 'My path in a few key steps.',
}

/* ----------------------------- Contact ---------------------------------- */

export const contact = {
  title: 'Contact',
  subtitle: 'A project, a role, a SaaS idea? Let’s talk — I reply within 24 hours.',
  formLabels: {
    name: 'Name',
    email: 'Email',
    message: 'Message',
    submit: 'Send message',
    sending: 'Sending…',
    success: 'Message sent — I’ll get back to you shortly.',
    error: 'Sending failed. Please email me directly.',
    mailtoInfo: 'Your mail client will open with the message pre-filled.',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'you@example.com',
    messagePlaceholder: 'Describe your project or your need…',
  },
}

export const disponibilite = {
  title: 'Working together',
  items: [
    {
      label: 'Freelance',
      detail: 'Fixed-price or time-and-materials engagements, from design through to production.',
    },
    {
      label: 'On site',
      detail: 'At your offices, on your team’s hours — including scoping phases and production releases.',
    },
    {
      label: 'Hybrid',
      detail: 'A few days on site, the rest remote, to whatever rhythm your team has settled on.',
    },
    {
      label: 'Remote',
      detail: 'A fully equipped workstation, available on your tools and your team rituals.',
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
    label: 'Phone',
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
  note: 'Designed and built with React, TypeScript & Three.js.',
}

/* -------------------- Metadata & interface labels ----------------------- */

export const meta = {
  htmlLang: 'en',
  ogLocale: 'en_US',
  title: 'Nathan Princer Diffo — Full Stack Developer, business process digitalisation',
  description:
    'Full Stack Developer based in Marrakech. I turn processes that live in spreadsheets and Word templates into applications teams use every day — from the interface to the server, payment and go-live included.',
  descriptionCourte:
    'I turn processes that live in spreadsheets and Word templates into applications teams use every day.',
}

export const ui = {
  skipLink: 'Skip to main content',
  navAriaLabel: 'Main navigation',
  menuOuvrir: 'Open menu',
  menuFermer: 'Close menu',
  langueLabel: 'Choose the site language',
  langueNom: { fr: 'French', en: 'English' } as Record<'fr' | 'en', string>,
  portraitAlt: (nom: string) => `Portrait of ${nom}`,
  captureAlt: (projet: string) => `Screenshot of ${projet}`,
  apercuAlt: (projet: string) => `Preview coming soon for ${projet}`,
  voirDemo: 'Watch the guided demo',
  demoTitre: 'Guided demo',
  demoAria: (projet: string) => `Guided demo — ${projet}`,
  demoFermerAria: 'Close the demo',
  fermer: 'Close',
  etape: (n: number, total: number) => `Step ${n} of ${total}`,
  precedent: 'Previous',
  suivant: 'Next',
  terminer: 'Finish',
  demoAvertissementAvant:
    'Screenshots from a demonstration instance — clients, candidates and files are',
  demoAvertissementFort: ' entirely fictional',
  demoAvertissementApres:
    '. The production tool handles confidential data and is not open to the public.',
  mailSujet: (nom: string) => `Portfolio enquiry — ${nom}`,
}
