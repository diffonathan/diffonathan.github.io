/**
 * Renseigne l'adresse d'une démonstration en ligne, dans les deux langues.
 *
 * Usage :
 *   node scripts/lier-demos.mjs Factura https://factura-xxxx.onrender.com
 *   node scripts/lier-demos.mjs "RDV Santé" https://rdv-sante-xxxx.onrender.com
 *
 * Pourquoi un script pour deux lignes : elles vivent dans DEUX fichiers —
 * `portfolio.ts` et `portfolio.en.ts` — et n'en modifier qu'un donne un site
 * dont la version anglaise n'a pas de bouton. Le défaut ne se voit pas tant
 * qu'on ne bascule pas la langue, c'est-à-dire presque jamais.
 *
 * Le script pose aussi `demoEveil: true` : les hébergements gratuits endorment
 * un service inactif, et le réveil prend près d'une minute. Le portfolio
 * l'annonce alors en toutes lettres, pour qu'une page blanche ne passe pas
 * pour une panne.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ici = dirname(fileURLToPath(import.meta.url))
const MODULES = ['portfolio.ts', 'portfolio.en.ts'].map((f) => join(ici, '..', 'src', 'data', f))

const [projet, adresse] = process.argv.slice(2)

if (!projet || !adresse) {
    console.error('Usage : node scripts/lier-demos.mjs <nom du projet> <adresse>')
    process.exit(1)
}

// Une adresse mal formée passerait sans bruit et donnerait un bouton mort.
// On vérifie ici plutôt que de le découvrir sur le site publié.
let url
try {
    url = new URL(adresse)
    if (url.protocol !== 'https:') throw new Error('protocole')
} catch {
    console.error(`Adresse invalide : « ${adresse} ». Attendu une URL en https.`)
    process.exit(1)
}

let touches = 0

for (const fichier of MODULES) {
    const source = readFileSync(fichier, 'utf8')

    // On repère l'entrée par son nom, puis son `demoUrl` — le PREMIER qui
    // suit. Chercher `demoUrl` sans ancrer sur le projet modifierait le
    // premier venu du fichier.
    const debut = source.indexOf(`name: '${projet}'`)
    if (debut === -1) {
        console.error(`Projet « ${projet} » introuvable dans ${fichier}`)
        process.exit(1)
    }

    const champ = source.indexOf('demoUrl:', debut)
    const finLigne = source.indexOf('\n', champ)

    if (champ === -1 || finLigne === -1) {
        console.error(`Champ demoUrl introuvable pour « ${projet} » dans ${fichier}`)
        process.exit(1)
    }

    const avant = source.slice(0, champ)
    const apres = source.slice(finLigne)
    const modifie = `${avant}demoUrl: '${url.href.replace(/\/$/, '')}',\n    demoEveil: true,${apres}`

    // Le champ `demoEveil` peut déjà exister d'une exécution précédente : on
    // retire l'ancien pour ne pas l'accumuler.
    const nettoye = modifie.replace(/\n {4}demoEveil: true,(\n {4}demoEveil: true,)+/g, '\n    demoEveil: true,')

    writeFileSync(fichier, nettoye, 'utf8')
    touches += 1
}

console.log(`« ${projet} » → ${url.href} (${touches} module(s) mis à jour)`)
console.log('Puis : npm run build && git add src/data && git commit && git push')
