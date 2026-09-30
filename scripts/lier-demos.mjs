/**
 * Renseigne l'adresse des démonstrations en ligne, dans les deux langues, et
 * reconstruit le site.
 *
 * Usage :
 *   node scripts/lier-demos.mjs --factura=https://xxx.onrender.com
 *   node scripts/lier-demos.mjs --rdv-sante=https://yyy.onrender.com
 *   node scripts/lier-demos.mjs --factura=https://xxx --rdv-sante=https://yyy
 *
 * UNE SEULE COMMANDE, et c'est délibéré. La version précédente demandait
 * d'enchaîner six commandes avec « && » — ce qui ne fonctionne pas dans
 * Windows PowerShell 5.1, où « && » n'est pas un séparateur. Une commande qui
 * ne marche que dans un shell sur deux est une commande à moitié écrite.
 *
 * Deux fichiers sont modifiés à chaque fois : `portfolio.ts` et
 * `portfolio.en.ts`. N'en toucher qu'un donnerait une version anglaise sans
 * bouton, et le défaut ne se verrait qu'en basculant la langue — c'est-à-dire
 * presque jamais.
 */
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ici = dirname(fileURLToPath(import.meta.url))
const racine = join(ici, '..')
const MODULES = ['portfolio.ts', 'portfolio.en.ts'].map((f) => join(racine, 'src', 'data', f))

/** Le nom de l'option, et le nom du projet tel qu'il est écrit dans les données. */
const PROJETS = {
    'factura': 'Factura',
    'rdv-sante': 'RDV Santé',
}

const demande = new Map()

for (const argument of process.argv.slice(2)) {
    const correspondance = argument.match(/^--([a-z-]+)=(.+)$/)

    if (!correspondance || !PROJETS[correspondance[1]]) {
        console.error(`Option inconnue : « ${argument} »`)
        console.error(`Attendu : ${Object.keys(PROJETS).map((c) => `--${c}=<adresse>`).join(' ')}`)
        process.exit(1)
    }

    demande.set(PROJETS[correspondance[1]], correspondance[2])
}

if (demande.size === 0) {
    console.error('Rien à faire. Exemple :')
    console.error('  node scripts/lier-demos.mjs --factura=https://factura-abcd.onrender.com')
    process.exit(1)
}

for (const [projet, adresse] of demande) {
    // Une adresse mal formée passerait sans bruit et donnerait un bouton mort
    // sur le site publié. On la refuse ici.
    let url
    try {
        url = new URL(adresse)
        if (url.protocol !== 'https:') throw new Error('protocole')
    } catch {
        console.error(`Adresse invalide pour « ${projet} » : ${adresse}`)
        console.error('Attendu une adresse complète en https, par exemple https://factura-abcd.onrender.com')
        process.exit(1)
    }

    const propre = url.href.replace(/\/$/, '')

    for (const fichier of MODULES) {
        const source = readFileSync(fichier, 'utf8')

        // On repère l'entrée par son NOM, puis son `demoUrl` — le premier qui
        // suit. Chercher `demoUrl` seul modifierait le premier venu du fichier.
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

        // On repart de l'existant : le champ `demoEveil` a pu être posé par un
        // passage précédent, et l'empiler donnerait un fichier invalide.
        const apres = source.slice(finLigne).replace(/^\n( {4}demoEveil: true,\n)+/, '\n')

        writeFileSync(
            fichier,
            `${source.slice(0, champ)}demoUrl: '${propre}',\n    demoEveil: true,${apres}`,
            'utf8',
        )
    }

    console.log(`✓ ${projet} → ${propre}`)
}

console.log('\nConstruction du site…')

// `execSync` et non `execFileSync` : sur Windows, `npm` est un script `.cmd`,
// et Node refuse désormais de lancer un `.cmd` directement — il répond EINVAL,
// un message qui ne désigne pas la cause. `execSync` passe toujours par un
// shell, qui sait résoudre `npm` aussi bien sur Windows que sur Linux.
execSync('npm run build', { cwd: racine, stdio: 'inherit' })

console.log('\nFait. Il reste à publier :')
console.log('  git add src/data')
console.log('  git commit -m "Adresses des demonstrations en ligne"')
console.log('  git push')
