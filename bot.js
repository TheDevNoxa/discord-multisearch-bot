const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fetch = require('node-fetch');
require('dotenv').config();

const client = new Client({ 
  intents: [GatewayIntentBits.Guilds] 
});

const API_BASE = 'https://www.multi-search.eu';

// ======================== FONCTIONS UTILITAIRES ========================

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

function formatDate(raw) {
  if (!raw) return null;
  const str = String(raw).slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}/.test(str)) return raw;
  try {
    return new Date(str).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return raw;
  }
}

// ======================== APPELS API ========================

async function searchAPI(params) {
  try {
    const query = new URLSearchParams(params);
    query.set('limit', '100');
    const url = `${API_BASE}/search?${query.toString()}`;
    
    console.log(`📡 Requête: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DiscordBot/1.0',
      },
      timeout: 30000
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Réponse reçue: ${data.results ? data.results.length : 0} résultats`);
    return data;
  } catch (err) {
    console.error(`❌ Erreur API: ${err.message}`);
    throw err;
  }
}

// ======================== CONSTRUCTION DES EMBEDS ========================

function buildResultEmbed(record, index) {
  const firstName = String(record.first_name || record.prenom || '').trim();
  const lastName = String(record.last_name || record.nom || '').trim();
  const name = [firstName, lastName].filter(Boolean).join(' ') || 'Inconnu';

  const embed = new EmbedBuilder()
    .setColor('#5865f2')
    .setTitle(`#${index + 1} - ${escapeHtml(name.toUpperCase())}`)
    .setTimestamp();

  // Identité
  if (firstName) embed.addFields({ name: '👤 Prénom', value: escapeHtml(firstName), inline: true });
  if (lastName) embed.addFields({ name: '👤 Nom', value: escapeHtml(lastName), inline: true });
  
  const birthDate = formatDate(record.birth_date || record.date_naissance);
  if (birthDate) embed.addFields({ name: '📅 Date de naissance', value: birthDate, inline: true });

  // Contact
  const email = String(record.email || '').trim();
  if (email) embed.addFields({ name: '📧 Email', value: escapeHtml(email), inline: false });

  const phone = String(record.phone || record.allocataire_phone || record.mobile || '').trim();
  if (phone) embed.addFields({ name: '📱 Téléphone', value: escapeHtml(phone), inline: true });

  // Adresse
  const address = String(record.address || record.voie || record.adresse || '').trim();
  if (address) embed.addFields({ name: '📍 Adresse', value: escapeHtml(address), inline: false });

  const city = String(record.city || record.ville || '').trim();
  const cp = String(record.postal_code || record.code_postal || '').trim();
  if (city || cp) {
    const location = [cp, city].filter(Boolean).join(' ');
    embed.addFields({ name: '🏙️ Localité', value: escapeHtml(location), inline: true });
  }

  // Champs supplémentaires
  const nir = String(record.nir || '').trim();
  if (nir) embed.addFields({ name: '🛡️ NIR', value: `\`${escapeHtml(nir)}\``, inline: true });

  const iban = String(record.iban || '').trim();
  if (iban) embed.addFields({ name: '🏦 IBAN', value: `\`${escapeHtml(iban)}\``, inline: true });

  if (record.source_file || record.provider) {
    embed.addFields({ name: '📄 Source', value: escapeHtml(record.source_file || record.provider || 'N/A'), inline: true });
  }

  return embed;
}

// ======================== PAGINATION ========================

async function displayPaginatedResults(interaction, results, summaryEmbed) {
  let currentPage = 0;
  const totalPages = results.length;

  if (totalPages === 0) {
    return interaction.editReply({ embeds: [summaryEmbed], content: '❌ Aucun résultat' });
  }

  // Crée les boutons
  const createButtons = (page) => {
    return new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('prev')
          .setLabel('◀️ Précédent')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(page === 0),
        new ButtonBuilder()
          .setCustomId('next')
          .setLabel('Suivant ▶️')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(page === totalPages - 1),
        new ButtonBuilder()
          .setCustomId('close')
          .setLabel('❌ Fermer')
          .setStyle(ButtonStyle.Danger)
      );
  };

  // Premier embed + boutons
  const firstEmbed = buildResultEmbed(results[0], 0);
  const pageInfo = new EmbedBuilder()
    .setColor('#5865f2')
    .setDescription(`📄 **Page ${currentPage + 1} / ${totalPages}**`);

  const msg = await interaction.editReply({ 
    embeds: [summaryEmbed, firstEmbed, pageInfo], 
    components: [createButtons(currentPage)] 
  });

  // Collecte les clics des boutons
  const collector = msg.createMessageComponentCollector({ 
    time: 600000 // 10 minutes
  });

  collector.on('collect', async (buttonInteraction) => {
    // Vérifie que c'est le même user
    if (buttonInteraction.user.id !== interaction.user.id) {
      return buttonInteraction.reply({ 
        content: '❌ Tu ne peux pas utiliser ces boutons', 
        ephemeral: true 
      });
    }

    // Gère les clics
    if (buttonInteraction.customId === 'next' && currentPage < totalPages - 1) {
      currentPage++;
    } else if (buttonInteraction.customId === 'prev' && currentPage > 0) {
      currentPage--;
    } else if (buttonInteraction.customId === 'close') {
      collector.stop();
      return buttonInteraction.deferUpdate();
    }

    // Affiche le résultat courant
    const currentEmbed = buildResultEmbed(results[currentPage], currentPage);
    const newPageInfo = new EmbedBuilder()
      .setColor('#5865f2')
      .setDescription(`📄 **Page ${currentPage + 1} / ${totalPages}**`);

    await buttonInteraction.update({ 
      embeds: [summaryEmbed, currentEmbed, newPageInfo],
      components: [createButtons(currentPage)]
    });
  });

  collector.on('end', async () => {
    try {
      await msg.edit({ components: [] }).catch(() => {});
    } catch (err) {
      console.error('Erreur lors de la suppression des boutons:', err);
    }
  });
}

// ======================== COMMANDES ========================

const commands = [
  new SlashCommandBuilder()
    .setName('search')
    .setDescription('🔍 Rechercher par critères')
    .addStringOption(opt => opt.setName('nom').setDescription('Nom de famille').setRequired(false))
    .addStringOption(opt => opt.setName('prenom').setDescription('Prénom').setRequired(false))
    .addStringOption(opt => opt.setName('email').setDescription('Email').setRequired(false))
    .addStringOption(opt => opt.setName('telephone').setDescription('Téléphone').setRequired(false))
    .addStringOption(opt => opt.setName('ville').setDescription('Ville').setRequired(false))
    .addStringOption(opt => opt.setName('code_postal').setDescription('Code postal').setRequired(false))
    .addStringOption(opt => opt.setName('adresse').setDescription('Adresse complète').setRequired(false))
    .addStringOption(opt => opt.setName('annee').setDescription('Année de naissance').setRequired(false)),

  new SlashCommandBuilder()
    .setName('searchfree')
    .setDescription('🔍 Recherche libre (email, nom, etc.)')
    .addStringOption(opt => opt.setName('query').setDescription('Terme de recherche').setRequired(true)),

  new SlashCommandBuilder()
    .setName('status')
    .setDescription('📊 État du bot'),
];

// ======================== ÉVÉNEMENTS ========================

client.once('ready', async () => {
  console.log(`\n✅ Bot connecté: ${client.user.tag}`);
  console.log(`📍 Serveurs: ${client.guilds.cache.size}`);
  
  try {
    await client.application.commands.set(commands);
    console.log('✅ Commandes enregistrées\n');
  } catch (err) {
    console.error('❌ Erreur enregistrement commandes:', err);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const cmd = interaction.commandName;

  try {
    if (cmd === 'search') {
      await handleSearch(interaction);
    } else if (cmd === 'searchfree') {
      await handleSearchFree(interaction);
    } else if (cmd === 'status') {
      await handleStatus(interaction);
    }
  } catch (err) {
    console.error(`Erreur ${cmd}:`, err);
    await interaction.reply({
      content: `❌ Erreur: ${err.message}`,
      ephemeral: true
    }).catch(() => {});
  }
});

// ======================== HANDLERS ========================

async function handleSearch(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const params = {};
  const nom = interaction.options.getString('nom');
  const prenom = interaction.options.getString('prenom');
  const email = interaction.options.getString('email');
  const telephone = interaction.options.getString('telephone');
  const ville = interaction.options.getString('ville');
  const cp = interaction.options.getString('code_postal');
  const adresse = interaction.options.getString('adresse');
  const annee = interaction.options.getString('annee');

  if (nom) params.lastName = nom;
  if (prenom) params.firstName = prenom;
  if (email) params.email = email;
  if (telephone) params.phone = telephone;
  if (ville) params.city = ville;
  if (cp) params.postal_code = cp;
  if (adresse) params.address = adresse;
  if (annee) params.birth_year = annee;

  if (Object.keys(params).length === 0) {
    return interaction.editReply('❌ Remplis au moins un critère !');
  }

  try {
    const data = await searchAPI(params);
    const results = Array.isArray(data.results) ? data.results : data.resultats || [];

    if (results.length === 0) {
      return interaction.editReply('❌ Aucun résultat trouvé.');
    }

    // Résumé
    const summaryEmbed = new EmbedBuilder()
      .setColor('#5865f2')
      .setTitle('🔍 Résultats de recherche')
      .setDescription(`**${results.length}** résultat(s) trouvé(s)`)
      .addFields({
        name: 'Critères',
        value: Object.entries(params).map(([k, v]) => `• **${k}**: ${v}`).join('\n'),
        inline: false
      });

    // Affiche la pagination
    await displayPaginatedResults(interaction, results, summaryEmbed);

  } catch (err) {
    await interaction.editReply(`❌ Erreur: ${err.message}`);
  }
}

async function handleSearchFree(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const query = interaction.options.getString('query');

  try {
    const data = await searchAPI({ query });
    const results = Array.isArray(data.results) ? data.results : data.resultats || [];

    if (results.length === 0) {
      return interaction.editReply(`❌ Aucun résultat pour "${query}".`);
    }

    // Résumé
    const summaryEmbed = new EmbedBuilder()
      .setColor('#5865f2')
      .setTitle('🔍 Recherche libre')
      .setDescription(`**${results.length}** résultat(s) pour **${escapeHtml(query)}**`);

    // Affiche la pagination
    await displayPaginatedResults(interaction, results, summaryEmbed);

  } catch (err) {
    await interaction.editReply(`❌ Erreur: ${err.message}`);
  }
}

async function handleStatus(interaction) {
  const uptime = Math.floor(client.uptime / 1000 / 60);
  const embed = new EmbedBuilder()
    .setColor('#22c55e')
    .setTitle('📊 Statut du bot')
    .addFields(
      { name: '✅ Statut', value: 'En ligne', inline: true },
      { name: '⏱️ Uptime', value: `${uptime} minutes`, inline: true },
      { name: '🖥️ Serveurs', value: String(client.guilds.cache.size), inline: true },
      { name: '👥 Utilisateurs', value: String(client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0)), inline: true },
      { name: '🔗 API', value: 'multi-search.eu', inline: true },
      { name: '⚡ Ping', value: `${client.ws.ping}ms`, inline: true }
    );

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

// ======================== CONNEXION ========================

client.login(process.env.DISCORD_TOKEN);