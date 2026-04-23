# Ressort.Calc — Guide de déploiement

Appli web d'estimation de temps de fabrication pour ressorts de torsion et rails.

---

## Déploiement sur Vercel (recommandé — 5 minutes)

### Option A : Avec GitHub (le plus simple)

**Étape 1 — Créer un compte GitHub** (si tu n'en as pas déjà)
Va sur [github.com](https://github.com) et inscris-toi (gratuit).

**Étape 2 — Créer un nouveau dépôt**
- Clique sur le `+` en haut à droite → `New repository`
- Nom : `ressort-calc`
- Laisse en `Public` (ou `Private` si tu préfères, les deux marchent avec Vercel)
- **NE coche PAS** « Add a README » ni « Add .gitignore » — on a déjà les fichiers
- Clique `Create repository`

**Étape 3 — Uploader les fichiers du projet**
Deux façons, choisis la plus simple pour toi :

*Méthode simple (sans ligne de commande) :*
- Sur la page du dépôt GitHub que tu viens de créer, clique `uploading an existing file`
- Glisse-dépose TOUS les fichiers et dossiers du projet (sauf `node_modules` et `dist` s'ils existent)
- Clique `Commit changes` en bas

*Méthode git (si tu connais un peu) :*
```bash
cd ressort-calc
git init
git add .
git commit -m "Initial"
git remote add origin https://github.com/TON_NOM/ressort-calc.git
git push -u origin main
```

**Étape 4 — Créer un compte Vercel**
- Va sur [vercel.com/signup](https://vercel.com/signup)
- Choisis « Continue with GitHub »
- Autorise Vercel à accéder à ton compte GitHub

**Étape 5 — Déployer**
- Sur le dashboard Vercel, clique `Add New...` → `Project`
- Cherche ton dépôt `ressort-calc` et clique `Import`
- Vercel détecte automatiquement que c'est un projet Vite — laisse tous les paramètres par défaut
- Clique `Deploy`
- Attends environ 60 secondes

**Étape 6 — Tu as une URL !**
Vercel te donne une URL du genre `ressort-calc-xyz.vercel.app`. C'est ton appli. Elle est en ligne 24/7, accessible de n'importe quel appareil.

### Option B : Sans GitHub (CLI Vercel)

Si tu préfères ne pas créer de compte GitHub :

```bash
cd ressort-calc
npm install -g vercel
vercel login
vercel --prod
```

Suis les invites, accepte les paramètres par défaut. Tu auras une URL en 30 secondes.

---

## Ajouter à l'écran d'accueil du téléphone

Une fois l'appli en ligne :

### iPhone / iPad
1. Ouvre l'URL dans **Safari** (pas Chrome, c'est important sur iOS)
2. Tape sur le bouton de partage (carré avec flèche vers le haut)
3. Fais défiler vers le bas et tape « Sur l'écran d'accueil »
4. Tape « Ajouter »
5. L'icône apparaît comme une vraie appli

### Android
1. Ouvre l'URL dans **Chrome**
2. Chrome proposera automatiquement « Ajouter à l'écran d'accueil »
3. Sinon, menu (⋮) en haut à droite → « Ajouter à l'écran d'accueil »
4. L'icône apparaît comme une vraie appli

Une fois ajoutée, l'appli s'ouvre en plein écran sans barre de navigation, comme une appli native. Tes employés peuvent faire la même chose sur leur téléphone.

---

## Mise à jour de l'appli

**Avec GitHub :** chaque fois que tu modifies un fichier sur GitHub, Vercel redéploie automatiquement en 30-60 secondes. Tu n'as rien à faire.

**Avec CLI :** relance `vercel --prod` dans le dossier.

---

## Développement local (optionnel)

Si tu veux tester des modifications sur ton ordinateur avant de déployer :

```bash
# Une fois seulement — installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Puis ouvre `http://localhost:5173` dans un navigateur.

---

## Structure du projet

```
ressort-calc/
├── public/
│   ├── manifest.json   → Config PWA (icône d'accueil)
│   ├── icon.svg        → Icône vectorielle
│   ├── icon-192.png    → Icône 192×192 (Android)
│   └── icon-512.png    → Icône 512×512 (iOS)
├── src/
│   ├── App.jsx         → L'appli complète (1500 lignes)
│   ├── main.jsx        → Point d'entrée React
│   └── index.css       → Styles de base
├── index.html          → Page HTML avec balises PWA
├── package.json        → Dépendances
├── vite.config.js      → Config du bundler
├── tailwind.config.js  → Config Tailwind CSS
└── postcss.config.js   → Config PostCSS
```

---

## Coûts

**Zéro.** Vercel offre un tier gratuit largement suffisant pour cette appli :
- 100 GB de bande passante / mois
- Déploiements illimités
- Domaine `.vercel.app` permanent

Tu peux éventuellement acheter un nom de domaine personnalisé (ex. `ressortcalc.com`) pour ~15 $/an et le pointer vers Vercel, mais ce n'est pas nécessaire.

---

## Besoin d'aide ?

Si quelque chose bloque, note exactement le message d'erreur et envoie-le — je peux te débugger ça.
