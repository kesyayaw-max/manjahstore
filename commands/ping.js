const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cekpingmu')
    .setDescription('Cek latency bot'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🏓 Woke!')
      .setColor(0x5865F2)
      .setDescription(`Pingmu: **${interaction.client.ws.ping} ms**`)
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });
  }
};
