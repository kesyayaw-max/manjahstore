const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  PermissionFlagsBits
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cataloggpt')
    .setDescription('Katalog layanan Chat Gpt premium')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setTitle(' DISC SHOP - Chat Gpt PREMIUM')
      .setDescription(`
**PRICE LIST Chat Gpt**

🚀 Chat Gpt Premium 1 M  
Rp 20.000


`)
      .setColor('#F47FFF')
      .setFooter({ text: 'DISC SHOP • Instant Delivery' });

    const menu = new StringSelectMenuBuilder()
      .setCustomId('pilih_chatgpt')
      .setPlaceholder('Pilih paket Chat Gpt')
      .addOptions([
        {
          label: 'Chat Gpt Premium 1 M (Private)',
          description: 'Rp 20.000',
          value: 'gpt_1'
        },
 
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
};
 