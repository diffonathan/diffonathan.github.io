# Portfolio — Nathan Princer Diffo

Portfolio personnel one-page : **React + Vite + TypeScript + Tailwind CSS v4 + Framer Motion + Three.js**.
Design system **charte Hope Traders** (zinc profond, glassmorphism, bleu marque `#0781FE`, or accent `#F9A825`),
animations au scroll, fond "réseau de neurones" en Three.js, 100 % responsive, SEO complet.

## Démarrage rapide

```bash
npm install
npm run dev        # http://localhost:5187
npm run build      # build de production dans dist/
npm run preview    # prévisualiser le build
```

## ✏️ Modifier le contenu (sans toucher au code)

**Tout le contenu vit dans un seul fichier : [`src/data/portfolio.ts`](src/data/portfolio.ts).**

Textes, projets, liens, stats, expérience, services… Cherchez les commentaires `TODO` pour les
éléments à personnaliser en priorité :

- `identity` — nom, localisation, email
- `hero.subtitle` — phrase d'accroche
- `about.bio` + `stats` — bio et chiffres clés
- `projects` — URLs de démo (`demoUrl`) et captures d'écran (`image`)
- `experience` — postes et dates
- `socials` — remplacez `VOTRE_USERNAME` par votre profil GitHub

## 📁 Fichiers à remplacer dans `public/`

| Fichier | Rôle |
|---|---|
| `cv.pdf` | Votre vrai CV (le fichier actuel est un placeholder) |
| `profile.jpg` | Votre photo (carrée, ≥ 400×400 px) — repli automatique sur les initiales si absente |
| `og.png` | Image de partage réseaux sociaux (1200×630) |
| `projects/*.png` | Captures d'écran des projets, référencées dans `portfolio.ts` |

## 📬 Formulaire de contact (Formspree, gratuit)

1. Créez un formulaire sur [formspree.io](https://formspree.io) (plan gratuit suffisant).
2. Copiez `.env.example` vers `.env` et renseignez :
   ```
   VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/VOTRE_ID
   ```
3. Sur Netlify/Vercel, ajoutez la même variable dans les **variables d'environnement** du projet.

Sans endpoint configuré, le formulaire ouvre le client mail du visiteur (mailto) en repli.

## 🚀 Déploiement

### Netlify

1. Poussez le projet sur GitHub.
2. Sur [netlify.com](https://netlify.com) : **Add new site → Import an existing project** → choisissez le repo.
3. Les réglages sont détectés via `netlify.toml` (build `npm run build`, publish `dist`).
4. Ajoutez `VITE_FORMSPREE_ENDPOINT` dans *Site settings → Environment variables*.

### Vercel

1. Poussez le projet sur GitHub.
2. Sur [vercel.com](https://vercel.com) : **Add New → Project** → importez le repo (framework **Vite** détecté).
3. Ajoutez `VITE_FORMSPREE_ENDPOINT` dans *Settings → Environment Variables*.

### Après déploiement

Dans [`index.html`](index.html), remplacez l'URL `https://nathan-princer-diffo.netlify.app/`
(balises `og:url`, `og:image`, `twitter:image`, `canonical`, JSON-LD) par votre domaine définitif.

## Structure

```
src/
├── data/portfolio.ts      ← TOUT le contenu éditable
├── components/
│   ├── Navbar.tsx         Navigation sticky + scroll-spy + menu mobile
│   ├── Hero.tsx           Plein écran + fond Three.js (lazy)
│   ├── ThreeBackground.tsx Réseau de particules (pause hors écran, reduced-motion)
│   ├── About.tsx          Bio + compteurs animés
│   ├── TechStack.tsx      Grille de catégories + badges
│   ├── Projects.tsx       Cards projets (2 col. desktop)
│   ├── Services.tsx       4 services
│   ├── Experience.tsx     Timeline verticale
│   ├── Contact.tsx        Formulaire Formspree + coordonnées
│   ├── Footer.tsx
│   └── ui/                Reveal (scroll), Badge, SectionHeading
└── index.css              Tokens du design system (couleurs, ombres, boutons)
```

## Design system (charte Hope Traders)

Tokens définis dans [`src/index.css`](src/index.css) (`@theme` + variables verre) :
`background #09090B`, surfaces translucides glassmorphism (blur 12px, liseré lumineux),
accent **bleu marque #0781FE** (hover `#0565C6`), or accent `#F9A825`, mots mis en
valeur en dégradé or/feu (`#FBCD25 → #F36E23`), textes `#FFFFFF` / `#D4D4D8` / `#B1B1B1`,
fond de charte fixe (halo bleu en haut à gauche, halo or en bas à droite).
Typographies : **DM Sans** (corps) + **Azeret Mono** (chiffres, tabular-nums).
Aucune couleur en dur dans les composants.
