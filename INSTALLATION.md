# 🤖 Bot Discord Multi-Search v2.0 - Guide Complet

## 📋 Prérequis

- **Node.js 16+** https://nodejs.org/
- **Un serveur Discord**
- **Un compte Discord**

---

## 🚀 Installation (5 minutes)

### 1️⃣ Créer l'application Discord

1. Va sur https://discord.com/developers/applications
2. Clique "New Application"
3. Donne un nom (ex: "Multi-Search Bot")
4. Dans l'onglet **"Bot"** → "Add Bot"

### 2️⃣ Copier le Token

1. Onglet **"Bot"** → "TOKEN"
2. Clique "Copy"
3. ⚠️ **NE LE MONTRE À PERSONNE**

### 3️⃣ Activer les Permissions

1. Onglet **"Bot"** → "Privileged Gateway Intents"
2. Active **rien** (les intents par défaut suffisent)
3. Onglet **"OAuth2"** → "URL Generator"
4. Scopes: Coche **"bot"**
5. Permissions: Coche **"Send Messages"**, **"Embed Links"**, **"Use Slash Commands"**
6. Copie l'URL générée et ouvre-la pour inviter le bot

### 4️⃣ Installer le Bot Localement

```bash
# Télécharge les fichiers ou clone le repo
cd mon-bot-discord

# Installe les dépendances
npm install

# Crée le fichier .env
# Édite .env et ajoute ton token:
# DISCORD_TOKEN=ton_token_ici

# Lance le bot
npm start
```

Tu devrais voir dans la console:
```
✅ Bot connecté: BotName#1234
📍 Serveurs: 1
✅ Commandes enregistrées
```

---

## 💬 Utiliser le Bot

### Commande 1: Recherche Structurée (`/search`)

Recherche par critères multiples:

```
/search nom:DUPONT prenom:Jean email:jean@example.com
/search telephone:0123456789 ville:Paris
/search code_postal:75001 annee:1990
```

**Paramètres disponibles:**
- `nom` - Nom de famille
- `prenom` - Prénom
- `email` - Email
- `telephone` - Téléphone
- `ville` - Ville
- `code_postal` - Code postal
- `adresse` - Adresse complète
- `annee` - Année de naissance

### Commande 2: Recherche Libre (`/searchfree`)

Cherche simplement par un terme:

```
/searchfree query:jean.dupont@gmail.com
/searchfree query:paris
/searchfree query:0123456789
```

### Commande 3: Status (`/status`)

Affiche l'état du bot:

```
/status
```

---

## 📁 Structure des fichiers

```
mon-bot-discord/
├── bot.js              ← Code principal
├── package.json        ← Dépendances
├── .env                ← Secrets (⚠️ NE PAS COMMITER)
├── .gitignore          ← Ignore .env sur GitHub
└── README.md           ← Ce fichier
```

---

## 🌐 Déployer en ligne (Gratuit)

### Option 1: Replit (Idéal pour démarrer)

1. Va sur https://replit.com
2. Crée un compte
3. Clique "Create Repl" → "Import from GitHub"
4. Colle l'URL du repo
5. "Secrets" (🔑) → Ajoute `DISCORD_TOKEN`
6. Clique "Run" (ou `npm start` dans la console)
7. **Bonus:** Ajoute le Replit Bouncer pour 24/7 uptime

### Option 2: Railway (Gratuit 500h/mois)

1. Va sur https://railway.app
2. Connecte ton GitHub
3. Import le repo
4. "Variables" → Ajoute `DISCORD_TOKEN`
5. Deploy automatique

### Option 3: Heroku (5€/mois)

```bash
heroku login
heroku create mon-bot-discord
heroku config:set DISCORD_TOKEN=token_ici
git push heroku main
```

---

## ⚙️ Personnalisation

### Changer la couleur des embeds

Dans `bot.js`, ligne 95:
```javascript
.setColor('#5865f2')  // Bleu Discord

// Autres couleurs:
.setColor('#22c55e')  // Vert
.setColor('#ef4444')  // Rouge
.setColor('#f97316')  // Orange
```

### Ajouter plus de critères de recherche

Dans `bot.js`, cherche `searchCommand` et ajoute:

```javascript
.addStringOption(opt => opt
  .setName('iban')
  .setDescription('Numéro IBAN')
  .setRequired(false))
```

Puis dans `handleSearch()`, ajoute:
```javascript
const iban = interaction.options.getString('iban');
if (iban) params.iban = iban;
```

### Changer le nombre de résultats affichés

Dans `handleSearch()` et `handleSearchFree()`, ligne ~220:
```javascript
for (let i = 0; i < Math.min(results.length, 3); i++) {
                                              // ^ change le 3
```

---

## 🔒 Sécurité

✅ **À faire:**
- `npm install` avant de lancer
- `.env` jamais commité (ajoute à `.gitignore`)
- Token régénéré si exposé publiquement
- Bot account (pas compte perso)

❌ **À NE JAMAIS faire:**
- Montrer ton token dans un chat
- Commiter `.env` sur GitHub
- Partager le token par email
- Utiliser le token du propriétaire

---

## 🛠️ Troubleshooting

| Erreur | Solution |
|--------|----------|
| `TokenInvalid` | Vérifie ton token dans `.env` |
| `Used disallowed intents` | Active les intents sur Dev Portal |
| `ENOENT: no such file or directory, open '.env'` | Crée le fichier `.env` |
| `Cannot find module 'discord.js'` | Lance `npm install` |
| `Bot ne répond pas` | Vérifie les permissions, redémarre |

---

## 📊 Commandes npm

```bash
# Lancer le bot
npm start

# Lancer en mode développement (reload auto)
npm run dev

# Installer les dépendances
npm install

# Mettre à jour les packages
npm update
```

---

## 📞 Logs & Debugging

Le bot affiche les logs pour chaque recherche:

```
📡 Requête: https://www.multi-search.eu/api/search?query=...
✅ Réponse reçue: 5 résultats
```

Si une erreur survient:
```
❌ Erreur API: HTTP 404
```

**Pour debugger:** Vérifiez la console et les messages d'erreur.

---

## 🎯 Roadmap Future

- [ ] Pagination boutons (prev/next)
- [ ] Export JSON/CSV
- [ ] Cache des résultats
- [ ] Recherche batch (CSV)
- [ ] Webhooks pour alertes
- [ ] Statistiques d'utilisation

---

## 📝 Licence

MIT - Libre d'utilisation

---

## ❓ FAQ

**Q: Peux-je chercher n'importe qui?**  
R: Oui, l'API est publique. Respecte les lois de confidentialité.

**Q: Mon token va-t-il être volé?**  
R: Non si tu le gardes dans `.env` et ne le partages pas.

**Q: Ça marche sans connexion internet?**  
R: Non, le bot a besoin d'une connexion pour atteindre l'API.

**Q: Combien de résultats max?**  
R: L'API en retourne 100, mais Discord affiche 3 par défaut (modifiable).

**Q: Comment ajouter plus de commandes?**  
R: Voir la section "Personnalisation" ci-dessus.

---

🚀 **Bon courage et amuse-toi bien avec le bot!**
