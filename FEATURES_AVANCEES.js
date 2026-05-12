// ======================== FEATURES AVANCÉES ========================
// À ajouter dans bot-multisearch.js

// 1️⃣ COMMANDE BATCH (PLUSIEURS RECHERCHES)
const batchCommand = new SlashCommandBuilder()
  .setName('recherche-batch')
  .setDescription('Rechercher plusieurs personnes (copie-colle une liste)')
  .addAttachmentOption(opt => opt.setName('fichier').setDescription('Fichier CSV ou TXT').setRequired(true));

// Dans le handler d'interaction :
// } else if (cmd === 'recherche-batch') {
//   await handleBatchCommand(interaction);
// }

async function handleBatchCommand(interaction) {
  await interaction.deferReply();

  const attachment = interaction.options.getAttachment('fichier');
  
  // Télécharge le fichier
  const response = await fetch(attachment.url);
  const content = await response.text();
  const lines = content.split('\n').filter(l => l.trim()).slice(0, 10); // Max 10 recherches

  const results = [];

  for (const line of lines) {
    try {
      // Parse CSV simple : nom,prenom,email
      const [nom, prenom, email] = line.split(',').map(s => s.trim());
      
      const params = {};
      if (nom) params.lastName = nom;
      if (prenom) params.firstName = prenom;
      if (email) params.email = email;

      if (Object.keys(params).length === 0) continue;

      const data = await search(params);
      const found = Array.isArray(data.results) ? data.results.length : 0;
      
      results.push({ ligne: line, resultats: found });
      
      // Évite les rate limits
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      results.push({ ligne: line, erreur: err.message });
    }
  }

  const embed = new EmbedBuilder()
    .setColor('#5865f2')
    .setTitle('📋 Résultats Batch')
    .setDescription(`${results.length} recherches traitées`)
    .addFields(
      { name: 'Résumé', value: results.map(r => `• ${r.ligne.split(',')[0]}: ${r.resultats ?? 0} résultats`).join('\n') }
    );

  await interaction.editReply({ embeds: [embed] });
}

// ======================== 2️⃣ EXPORT JSON ========================

async function handleExportCommand(interaction) {
  // À utiliser après une recherche
  const jsonData = JSON.stringify(lastSearchResults, null, 2);
  const buffer = Buffer.from(jsonData);
  
  const attachment = {
    attachment: buffer,
    name: `export_${Date.now()}.json`
  };

  await interaction.reply({ files: [attachment], ephemeral: true });
}

// ======================== 3️⃣ ALERTES RÉCURRENTES ========================

const schedule = require('node-schedule');

// Lance une recherche tous les jours à 9h
schedule.scheduleJob('0 9 * * *', async () => {
  const channel = client.channels.cache.get('CHANNEL_ID_ICIICI');
  
  try {
    const data = await search({ email: 'email@example.com' });
    const results = Array.isArray(data.results) ? data.results : [];
    
    if (results.length > 0) {
      const embed = new EmbedBuilder()
        .setColor('#22c55e')
        .setTitle('🔔 Alerte quotidienne')
        .setDescription(`${results.length} résultat(s) trouvé(s)`)
        .setTimestamp();
      
      await channel.send({ embeds: [embed] });
    }
  } catch (err) {
    console.error('Erreur alerte :', err);
  }
});

// Ajoute à package.json : "node-schedule": "^2.1.1"

// ======================== 4️⃣ CACHE REDIS (OPTIONNEL) ========================

const redis = require('redis');
const redisClient = redis.createClient();

async function searchWithCache(params) {
  const cacheKey = JSON.stringify(params);
  
  // Vérifie le cache
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    console.log('✅ Cache hit');
    return JSON.parse(cached);
  }
  
  // Recherche API
  const data = await search(params);
  
  // Stocke en cache (1 heure)
  await redisClient.setex(cacheKey, 3600, JSON.stringify(data));
  
  return data;
}

// ======================== 5️⃣ RÉACTIONS EMOJI ========================

client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return;
  
  // Si quelqu'un react avec 🔄, relance la recherche
  if (reaction.emoji.name === '🔄') {
    const msg = reaction.message;
    // Récupère le query depuis l'embed
    const embed = msg.embeds[0];
    if (embed) {
      console.log('Relance recherche...');
      // À implémenter selon tes besoins
    }
  }
});

// ======================== 6️⃣ STATS & LOGS ========================

const stats = {
  searchCount: 0,
  totalResults: 0,
  errors: 0,
  startTime: Date.now()
};

async function logSearch(params, results, error = null) {
  stats.searchCount++;
  if (!error) {
    stats.totalResults += results.length;
  } else {
    stats.errors++;
  }
  
  // Optionnel : envoie les stats à une BD
  console.log(`📊 Stats: ${stats.searchCount} recherches, ${stats.totalResults} résultats`);
}

const statsCommand = new SlashCommandBuilder()
  .setName('stats')
  .setDescription('Voir les stats du bot');

async function handleStatsCommand(interaction) {
  const uptime = Math.floor((Date.now() - stats.startTime) / 1000 / 60);
  
  const embed = new EmbedBuilder()
    .setColor('#5865f2')
    .setTitle('📊 Statistiques du Bot')
    .addFields(
      { name: 'Recherches', value: String(stats.searchCount), inline: true },
      { name: 'Résultats totaux', value: String(stats.totalResults), inline: true },
      { name: 'Erreurs', value: String(stats.errors), inline: true },
      { name: 'Uptime', value: `${uptime} minutes`, inline: true }
    );
  
  await interaction.reply({ embeds: [embed], ephemeral: true });
}

// ======================== 7️⃣ WEBHOOK REVERSE (NOTIFICATIONS) ========================

const express = require('express');
const app = express();

app.post('/webhook', express.json(), async (req, res) => {
  const { query, results } = req.body;
  
  const channel = client.channels.cache.get('WEBHOOK_CHANNEL_ID');
  if (!channel) return res.status(404).send('Channel not found');
  
  const embed = new EmbedBuilder()
    .setColor('#22c55e')
    .setTitle('🔔 Nouveau résultat via Webhook')
    .setDescription(`${results.length} résultats pour "${query}"`);
  
  await channel.send({ embeds: [embed] });
  res.json({ ok: true });
});

app.listen(3000, () => console.log('🌐 Webhook ready on :3000'));

// ======================== 8️⃣ PAGINE LES RÉSULTATS ========================

async function handlePaginationCommand(interaction) {
  await interaction.deferReply();

  const query = interaction.options.getString('query');
  const data = await search({ query });
  const results = Array.isArray(data.results) ? data.results : [];

  if (results.length === 0) {
    return interaction.editReply('❌ Aucun résultat.');
  }

  let currentPage = 0;
  const pageSize = 1; // 1 résultat par page

  const createEmbed = (pageNum) => {
    const result = results[pageNum];
    if (!result) return null;
    return buildResultEmbed(result, pageNum);
  };

  const embed = createEmbed(0);
  const buttons = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('prev')
        .setLabel('◀️ Précédent')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentPage === 0),
      new ButtonBuilder()
        .setCustomId('next')
        .setLabel('Suivant ▶️')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentPage === results.length - 1),
      new ButtonBuilder()
        .setCustomId('close')
        .setLabel('❌ Fermer')
        .setStyle(ButtonStyle.Danger)
    );

  const msg = await interaction.editReply({ embeds: [embed], components: [buttons] });

  const collector = msg.createMessageComponentCollector({ time: 300000 });

  collector.on('collect', async (buttonInteraction) => {
    if (buttonInteraction.user.id !== interaction.user.id) {
      return buttonInteraction.reply({ content: '❌ Tu ne peux pas utiliser ces boutons', ephemeral: true });
    }

    if (buttonInteraction.customId === 'next') {
      currentPage = Math.min(currentPage + 1, results.length - 1);
    } else if (buttonInteraction.customId === 'prev') {
      currentPage = Math.max(currentPage - 1, 0);
    } else if (buttonInteraction.customId === 'close') {
      collector.stop();
      return;
    }

    const newEmbed = createEmbed(currentPage);
    const newButtons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('prev')
          .setLabel('◀️ Précédent')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(currentPage === 0),
        new ButtonBuilder()
          .setCustomId('next')
          .setLabel('Suivant ▶️')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(currentPage === results.length - 1),
        new ButtonBuilder()
          .setCustomId('close')
          .setLabel('❌ Fermer')
          .setStyle(ButtonStyle.Danger)
      );

    await buttonInteraction.update({ embeds: [newEmbed], components: [newButtons] });
  });

  collector.on('end', async () => {
    await msg.edit({ components: [] }).catch(() => {});
  });
}

// ======================== INTÉGRATION DANS LE BOT ========================
/*
1. Ajoute à package.json :
   "node-schedule": "^2.1.1",
   "redis": "^4.6.0",
   "express": "^4.18.2"

2. Enregistre les nouvelles commandes :
   const commands = [
     searchCommand, 
     directCommand, 
     advancedCommand,
     batchCommand,
     statsCommand,
     // ...
   ];

3. Ajoute les handlers :
   } else if (cmd === 'recherche-batch') {
     await handleBatchCommand(interaction);
   } else if (cmd === 'stats') {
     await handleStatsCommand(interaction);
   }

4. Lance le webhook Express quand le bot démarre
*/
