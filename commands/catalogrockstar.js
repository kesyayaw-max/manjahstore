const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  PermissionFlagsBits
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('catalogrockstar')
    .setDescription('Katalog layanan Rockstar Account For FiveM')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setTitle(' DISC SHOP - ROCKSTAR ACCOUNT')
      .setDescription(`
**PRICE LIST ACCOUNT ROCKSTAR**

🚀 ROCKSTAR ACCOUNT FOR FIVEM
Rp 35.000

`)
      .setColor('#F47FFF')
      .setFooter({ text: 'DISC SHOP • Instant Delivery' });

    const menu = new StringSelectMenuBuilder()
      .setCustomId('pilih_rockstar')
      .setPlaceholder('Pilih Akun rockstar untuk FiveM')
      .addOptions([
        {
          label: 'Netflix Premium 1 Days',
          description: 'Rp 10.000',
          value: 'rockstar'
        },
    
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
};
 