# 🤖 Discord Bot Multi-Search

Un bot Discord intuitif pour rechercher des informations sur [multi-search.eu](https://www.multi-search.eu) directement depuis Discord.

![Discord](https://img.shields.io/badge/Discord.js-14.14-blue?logo=discord)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

---

## 📖 Table des matières

- [🎯 Vue d'ensemble](#-vue-densemble)
- [💬 Comment ça marche](#-comment-ça-marche)
- [📋 Commandes disponibles](#-commandes-disponibles)
- [🔍 Exemples d'utilisation](#-exemples-dutilisation)
- [📊 Comprendre les résultats](#-comprendre-les-résultats)
- [🎮 Naviguer dans les résultats](#-naviguer-dans-les-résultats)
- [🔒 Sécurité et confidentialité](#-sécurité-et-confidentialité)
- [❓ FAQ](#-faq)

---

## 🎯 Vue d'ensemble

Ce bot te permet de:

✅ **Rechercher des personnes** par nom, prénom, email, téléphone, etc.  
✅ **Voir les résultats** directement dans Discord  
✅ **Naviguer facilement** avec des boutons (page par page)  
✅ **Garder les résultats privés** (invisible pour les autres utilisateurs)  
✅ **Vérifier l'état du bot** en temps réel

Le bot fait automatiquement:
- 🔍 Requête à l'API multi-search.eu
- 📦 Récupère les résultats
- 🎨 Formate les résultats joliment
- 📄 Affiche une page à la fois
- 🔒 Les rend visibles **QUE pour toi**

---

## 💬 Comment ça marche

### Le flux complet:

```
Toi: /search nom:DUPONT
  ↓
Bot reçoit la commande
  ↓
Bot envoie une requête à multi-search.eu
  ↓
multi-search.eu retourne les résultats
  ↓
Bot formate les résultats joliment
  ↓
Bot affiche: "Résumé" + "Page 1/X"
  ↓
Toi: Tu cliques sur "Suivant ▶️"
  ↓
Bot affiche: "Page 2/X"
```

### Temps de réponse:

Généralement **< 2 secondes** de la commande à l'affichage des résultats.

Si c'est plus long, c'est parce que:
- L'API multi-search.eu est lente
- Tu as trop de critères de recherche
- La requête retourne beaucoup de résultats

---

## 📋 Commandes disponibles

### 1️⃣ `/search` - Recherche structurée

La commande **principale**. Cherche par critères spécifiques.

```
/search nom:DUPONT prenom:Jean email:jean@example.com
```

**Paramètres disponibles:**

| Paramètre | Description | Exemple |
|-----------|-------------|---------|
| `nom` | Nom de famille | DUPONT |
| `prenom` | Prénom | Jean |
| `email` | Adresse email | jean@example.com |
| `telephone` | Numéro de téléphone | 0123456789 |
| `ville` | Ville | Paris |
| `code_postal` | Code postal | 75001 |
| `adresse` | Adresse complète | 123 rue de la Paix |
| `annee` | Année de naissance | 1990 |

⚠️ **Important:** Tu dois remplir **au moins 1 critère**, sinon le bot dira "Remplis au moins un critère!"

---

### 2️⃣ `/searchfree` - Recherche libre

Cherche n'importe quel terme (utile si tu ne sais pas quelle catégorie).

```
/searchfree query:paris
/searchfree query:jean.dupont@gmail.com
/searchfree query:0123456789
```

Le bot cherchera dans **tous les champs** disponibles.

---

### 3️⃣ `/status` - État du bot

Affiche les statistiques du bot.

```
/status
```

Affiche:
- ✅ Statut (En ligne / Offline)
- ⏱️ Uptime (depuis combien de temps il tourne)
- 🖥️ Serveurs (nombre de serveurs où le bot est)
- 👥 Utilisateurs (total d'utilisateurs sur tous les serveurs)
- 🔗 API (quelle API est utilisée)
- ⚡ Ping (latence Discord ↔ Bot)

---

## 🔍 Exemples d'utilisation

### Exemple 1: Chercher par nom et prénom

```
/search nom:MARTIN prenom:Anne
```

**Résultat:**
```
🔍 Résultats de recherche
✅ 3 résultat(s) trouvé(s)

Critères:
• lastName: MARTIN
• firstName: Anne

📄 Page 1 / 3

#1 - ANNE MARTIN
👤 Prénom: Anne
👤 Nom: MARTIN
📅 Date de naissance: 15/03/1985
📧 Email: anne.martin@gmail.com
📱 Téléphone: 06 12 34 56 78
📍 Adresse: 45 rue de Lyon
🏙️ Localité: 75012 Paris

[◀️ Précédent]  [▶️ Suivant]  [❌ Fermer]
```

Tu cliques "Suivant" pour voir Anne Martin #2, etc.

---

### Exemple 2: Chercher par email uniquement

```
/searchfree query:john.doe@example.com
```

Le bot cherchera cet email dans **tous les champs**.

---

### Exemple 3: Chercher par ville et code postal

```
/search ville:Bordeaux code_postal:33000
```

Trouve toutes les personnes à Bordeaux (33000).

---

### Exemple 4: Chercher par année de naissance

```
/search annee:1995
```

Trouve tous les gens nés en 1995.

---

## 📊 Comprendre les résultats

### Chaque résultat affiche:

```
#N - NOM COMPLET
👤 Prénom: Jean
👤 Nom: DUPONT
📅 Date de naissance: 20/05/1990
📧 Email: jean.dupont@example.com
📱 Téléphone: 06 12 34 56 78
📍 Adresse: 123 avenue des Champs
🏙️ Localité: 75008 Paris
🛡️ NIR: 1900512345678901
🏦 IBAN: FR1420041010050500013M02
📄 Source: Base de données publique
```

### Explication des champs:

| Icône | Champ | Explication |
|-------|-------|-------------|
| 👤 | Prénom | Prénom de la personne |
| 👤 | Nom | Nom de famille |
| 📅 | Date de naissance | Au format JJ/MM/AAAA |
| 📧 | Email | Adresse email |
| 📱 | Téléphone | Numéro de téléphone |
| 📍 | Adresse | Adresse complète (rue, numéro) |
| 🏙️ | Localité | Code postal + Ville |
| 🛡️ | NIR | Numéro d'identification (optionnel) |
| 🏦 | IBAN | Numéro de compte bancaire (optionnel) |
| 📄 | Source | D'où viennent les données |

⚠️ **Note:** Certains champs peuvent manquer si les données ne sont pas disponibles.

---

## 🎮 Naviguer dans les résultats

### Les 3 boutons:

```
[◀️ Précédent]  [▶️ Suivant]  [❌ Fermer]
```

#### ◀️ Précédent
- Affiche le résultat **précédent**
- Bouton **grisé** (désactivé) si tu es à la page 1
- Raccourci: Click et bim, tu remontes

#### ▶️ Suivant
- Affiche le résultat **suivant**
- Bouton **grisé** (désactivé) si tu es à la dernière page
- Raccourci: Click et tu avances

#### ❌ Fermer
- Ferme la **pagination**
- Les boutons disparaissent
- Tu ne peux plus naviguer

### Indicateur de page:

En bas de chaque résultat, tu vois:

```
📄 **Page 1 / 5**
```

Cela signifie:
- Tu es actuellement à la **page 1**
- Il y a **5 résultats au total**

---

## 🔒 Sécurité et confidentialité

### Les messages sont PRIVÉS

✅ **Seul tu vois les résultats**

Quand tu utilises `/search`, le bot envoie les résultats **en privé** (ephemeral):
- Les autres utilisateurs du serveur **NE VOIENT PAS** les résultats
- Les modérateurs **NE VOIENT PAS** les résultats
- Seul **TOI** tu vois les messages

Cela apparaît ainsi dans le chat:
```
Toi: /search nom:DUPONT
Bot: 🔍 Résultats de recherche (visible QUE pour toi)
```

### Sécurité des boutons

✅ **Seul tu peux naviguer**

Les boutons (Précédent/Suivant) sont protégés:
- Si quelqu'un d'autre essaie de cliquer → Erreur "Tu ne peux pas utiliser ces boutons"
- Seul l'utilisateur qui a lancé la recherche peut naviguer

---

## ❓ FAQ

### Q: Combien de temps les résultats restent-ils?

**R:** 10 minutes. Après 10 minutes, les boutons disparaissent et tu ne peux plus naviguer.

---

### Q: Je peux voir les résultats des autres?

**R:** Non. Les résultats sont complètement privés. Seul l'utilisateur qui a lancé la recherche les voit.

---

### Q: Qu'est-ce que j'arrive pas à trouver une personne?

**R:** Possible raisons:
- ❌ La personne n'existe pas dans la base de données
- ❌ Tu as mal orthographié le nom
- ❌ Tu as des critères trop restrictifs
- ❌ La personne a changé de données (email, téléphone)

**Solution:** Essaie avec moins de critères. Exemple: cherche seulement par nom au lieu de nom + prénom + email.

---

### Q: Ça prend trop de temps!

**R:** C'est normal si:
- 📡 L'API est slow (reseau lent)
- 📊 La requête retourne beaucoup de résultats
- 🔍 Tu as beaucoup de critères

**Solution:** Essaie une recherche plus simple avec moins de critères.

---

### Q: Je reçois "Erreur 403"?

**R:** C'est que l'API multi-search.eu bloque la requête.

**Solutions:**
1. Attends quelques secondes et réessaie
2. Essaie avec moins de critères
3. Utilise `/searchfree` à la place

---

### Q: Les résultats ne sont pas à jour?

**R:** Les données viennent de multi-search.eu. Si les données ne sont pas à jour là-bas, elles ne seront pas à jour ici non plus.

---

### Q: Le bot est offline!

**R:** Possible raisons:
- 🔌 Pas de connexion internet
- 🖥️ Le serveur d'hébergement est down
- 🐛 Bug du bot

**Solution:** Attends quelques minutes. Si ça persiste, contacte l'admin.

---

### Q: Je peux modifier les résultats?

**R:** Non. Les résultats viennent directement de multi-search.eu. Tu ne peux que les consulter.

---

### Q: Y a-t-il une limite de recherches par jour?

**R:** Non, pas de limite imposée par le bot. Mais l'API multi-search.eu pourrait avoir ses propres limites.

---

### Q: Je peux exporter les résultats?

**R:** Actuellement non. Mais tu peux:
- 📸 Faire des screenshots
- 📋 Copier-coller les informations
- 💾 Enregistrer les résultats manuellement

---

## 🎓 Conseils d'utilisation

### ✅ À faire:

✅ Sois **spécifique** dans tes critères (nom + prénom c'est mieux que juste le nom)  
✅ Utilise `/searchfree` si tu **ne sais pas** quel champ chercher  
✅ Regarde le **nombre de résultats** - s'il y en a 100+, affine ta recherche  
✅ Vérifie l'**orthographe** (accents, majuscules)  
✅ Utilise `/status` pour **vérifier** que le bot fonctionne  

### ❌ À éviter:

❌ Ne cherche **pas de résultats trop proches** (500+ résultats = lent)  
❌ Ne fais **pas 100 recherches** d'affilée (rate limiting possible)  
❌ Ne partage **pas les résultats** en public (confidentialité)  
❌ N'utilise **pas le bot pour du harcèlement** (illégal)  

---

## 📞 Besoin d'aide?

Si le bot ne fonctionne pas:

1. **Essaie une recherche simple** - `/searchfree query:paris`
2. **Vérifie l'état** - `/status`
3. **Attends quelques secondes** et réessaie
4. **Contacte l'admin du serveur** si ça persiste

---

## 📚 Informations supplémentaires

### Source des données:

Les données viennent de **[multi-search.eu](https://www.multi-search.eu)**.

Respect de la confidentialité:
- 🔒 Utilise les données **légalement**
- 📋 Respecte les **lois locales**
- 🔐 Ne partage **pas les résultats** en public

### Qui peut utiliser le bot?

✅ Tous les utilisateurs du serveur Discord où le bot est installé.

---

## 🎯 Résumé rapide

| Besoin | Commande | Exemple |
|--------|----------|---------|
| Chercher par critères | `/search` | `/search nom:DUPONT prenom:Jean` |
| Chercher librement | `/searchfree` | `/searchfree query:paris` |
| Vérifier le bot | `/status` | `/status` |
| Naviguer | Boutons | ◀️ ▶️ ❌ |
| Voir résultats privés | Automatique | Seul toi vois ✅ |

---

## 🚀 C'est prêt!

Tu peux maintenant:
1. Utiliser `/search` ou `/searchfree`
2. Naviguer avec les boutons
3. Consulter les résultats en toute sécurité

**Bon courage! 🎉**

---

**Fait avec ❤️ pour Discord**

Pour des questions techniques, contacte l'admin du bot.
