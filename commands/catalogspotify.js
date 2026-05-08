const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  PermissionFlagsBits
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('catalogspotify')
    .setDescription('Katalog layanan spotify premium')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setTitle(' DISC SHOP - NETFLIX PREMIUM')
      .setDescription(`
**PRICE LIST SPOTIFY**

🚀 Spotify Premium 1 M  
Rp 25.000


`)
      .setColor('#F47FFF')
      .setFooter({ text: 'DISC SHOP • Instant Delivery' });

    const menu = new StringSelectMenuBuilder()
      .setCustomId('pilih_spotify')
      .setPlaceholder('Pilih paket Spotify')
      .addOptions([
        {
          label: 'Netflix Premium 1 M (Private)',
          description: 'Rp 25.000',
          value: 'spotify_1'
        },
 
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
};
 