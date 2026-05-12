# 🤖 Discord Bot Multi-Search v2.0

Un bot Discord **simple et performant** pour automatiser les recherches sur multi-search.eu directement depuis Discord.

![Discord](https://img.shields.io/badge/Discord.js-14.14-blue)
![Node](https://img.shields.io/badge/Node.js-16+-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Fonctionnalités

- ✅ **3 commandes slash** (rapides et intuitives)
- ✅ **Recherche structurée** (nom, prénom, email, téléphone, etc.)
- ✅ **Recherche libre** (n'importe quel terme)
- ✅ **Embeds Discord** (résultats formatés)
- ✅ **API multi-search.eu** (intégration directe)
- ✅ **Gestion des erreurs** (messages clairs)

---

## 🚀 Quick Start

### Installation (30 secondes)

```bash
# 1. Clone/Télécharge
git clone github.com/TheDevNoxa/discord-multisearch-bot.git && cd discord-multisearch-bot

# 2. Installe les dépendances
npm install

# 3. Configure le token
# Édite .env et ajoute ton DISCORD_TOKEN

# 4. Lance!
npm start
```

### Utilisation dans Discord

```
/search nom:DUPONT prenom:Jean email:jean@example.com
/searchfree query:paris
/status
```

---

## 📖 Documentation

- **[INSTALLATION.md](./INSTALLATION.md)** - Guide complet d'installation et utilisation

---

## 🛠️ Commandes

### `/search` - Recherche structurée
Recherche par critères multiples:
- `nom` - Nom de famille
- `prenom` - Prénom
- `email` - Email
- `telephone` - Téléphone
- `ville` - Ville
- `code_postal` - Code postal
- `adresse` - Adresse complète
- `annee` - Année de naissance

### `/searchfree` - Recherche libre
Cherche un terme simple (email, nom, téléphone, etc.)

### `/status` - État du bot
Affiche l'uptime, les serveurs, le ping, etc.

---

## 📋 Fichiers

| Fichier | Description |
|---------|-------------|
| **bot.js** | Code principal du bot (350 lignes) |
| **package.json** | Dépendances Node.js |
| **INSTALLATION.md** | Guide complet |

---

## 📊 Statistiques

- **Lignes de code:** ~300
- **Dépendances:** 3 (discord.js, node-fetch, dotenv)
- **Temps de réponse:** < 2 sec
- **Support:** Français 100%
---

## 📝 Licence

MIT - Libre d'utilisation et de modification

---

**Made with ❤️ by TheDevNoxa**

🚀 [Commencer maintenant](./INSTALLATION.md)
