# 🤖 Bot Discord Multi-Search - Guide d'Installation

## 📋 Prérequis

- **Node.js** 16+ ([télécharger](https://nodejs.org/))
- **Un serveur Discord** (ou en créer un)
- **Un compte Discord** pour le bot

---

## 🚀 Installation rapide

### 1️⃣ Créer l'application Discord

1. Va sur [Discord Developer Portal](https://discord.com/developers/applications)
2. Clique sur "New Application" et donne-lui un nom (ex: "Multi-Search Bot")
3. Va dans l'onglet **"Bot"** → clique "Add Bot"
4. Sous "TOKEN", clique "Copy" et enregistre-le quelque part (⚠️ **Secret**)

### 2️⃣ Configurer les permissions

1. Dans "OAuth2" → "URL Generator"
2. Sélectionne les scopes : **bot**
3. Sélectionne les permissions :
   - `Send Messages`
   - `Embed Links`
   - `Read Messages/View Channels`
   - `Use Slash Commands`
4. Copie l'URL générée et accède-la dans ton navigateur pour inviter le bot

### 3️⃣ Installer le bot localement

```bash
# Clone ou télécharge les fichiers
git clone <repo_url>
cd multi-search-discord-bot

# Installe les dépendances
npm install

# Crée le fichier .env
cp .env.example .env

# Édite .env et ajoute ton TOKEN Discord
# DISCORD_TOKEN=ton_token_ici
```

### 4️⃣ Lancer le bot

```bash
npm start
```

Tu devrais voir :
```
✅ Bot connecté en tant que Multi-Search Bot#1234
✅ Commandes enregistrées
```

---

## 💾 Déploiement en ligne (gratuit)

### Option 1 : **Replit** (Recommandé)

1. Va sur [replit.com](https://replit.com) et crée un compte
2. Clique "Create" → "Import from GitHub"
3. Colle l'URL du repo (ou upload les fichiers)
4. Crée les variables d'environnement :
   - Va dans "Secrets" (🔑)
   - Ajoute `DISCORD_TOKEN` avec ton token
5. Lance avec `npm start`
6. Crée un Replit Bouncer pour garder le bot actif 24/7

### Option 2 : **Railway.app** (Gratuit 500h/mois)

1. Va sur [railway.app](https://railway.app)
2. Connecte ton GitHub ou upload directement
3. Ajoute les variables d'env dans "Variables"
4. Deploy automatiquement

### Option 3 : **Heroku** (Payant mais simple)

```bash
heroku login
heroku create mon-bot-multisearch
heroku config:set DISCORD_TOKEN=mon_token
git push heroku main
```

---

## 📝 Utilisation

### Commande 1 : `/recherche` (Structurée)

```
/recherche nom:DUPONT prenom:Jean email:jean@gmail.com
```

**Options disponibles :**
- `nom` - Nom de famille
- `prenom` - Prénom
- `email` - Adresse email
- `telephone` - Numéro de téléphone
- `ville` - Ville de résidence
- `code_postal` - Code postal
- `adresse` - Adresse complète
- `nir` - Numéro de sécurité sociale
- `annee` - Année de naissance

### Commande 2 : `/recherche-directe` (Libre)

```
/recherche-directe query:jean.dupont@gmail.com
```

Utile pour chercher par email, téléphone, ou n'importe quel terme.

### Commande 3 : `/recherche-avancee` (Formulaire)

Ouvre un formulaire modal pour remplir les critères facilement.

---

## 🔧 Personnalisation

### Changer la couleur des embeds

Dans `buildResultEmbed()`, change `.setColor('#5865f2')` par une couleur hex :
- `#FF5733` (Rouge)
- `#22c55e` (Vert)
- `#3b82f6` (Bleu)

### Augmenter le nombre de résultats affichés

Cherche `pageSize = 3` et change à `10` (attention : Discord limite 10 embeds par message)

### Ajouter des champs personnalisés

Ajoute dans `buildResultEmbed()` :

```javascript
const myField = String(record.mon_champ || '').trim();
if (myField) embed.addFields({ name: 'Mon Champ', value: escapeHtml(myField), inline: true });
```

---

## ⚠️ Dépannage

### "Token invalide"
- Vérifie que tu as copié le **bon** token
- Crée un nouveau token sur Discord Dev Portal

### "Bot ne répond pas"
- Assure-toi que le bot a les **permissions**
- Redémarre le bot : `Ctrl+C` puis `npm start`

### "Erreur API 403"
- Le site bloquerait peut-être les bots
- Essaie avec des délais : `await new Promise(r => setTimeout(r, 1000));`

### "Trop de résultats"
- Discord limite à ~10 embeds par interaction
- Limiter à 5 résultats affichés (voir code)

---

## 🛡️ Sécurité

⚠️ **IMPORTANT :**
- **Ne jamais commit** ton `.env` sur GitHub → ajoute à `.gitignore`
- Utilise un bot token **secret** (pas le token de ton compte perso)
- Considère les résultats comme **sensibles** → restreins le bot à certains rôles/canaux

Exemple de restriction par rôle :

```javascript
if (!interaction.member.roles.cache.has('ID_ROLE_AUTORISE')) {
  return interaction.reply({ content: '❌ Pas autorisé', ephemeral: true });
}
```

---

## 📊 Améliorations futures

- [ ] Pagination des résultats (boutons suivant/précédent)
- [ ] Export en JSON/CSV
- [ ] Cache des résultats
- [ ] Historique des recherches
- [ ] Filtrage côté client
- [ ] Support de plusieurs serveurs Discord

---

## 📞 Support

Si tu as des questions :
1. Vérifie les logs de la console
2. Regarde les erreurs Discord Dev Portal
3. Teste avec une commande simple d'abord

Bon courage ! 🚀
