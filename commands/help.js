const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nama_command')
    .setDescription('Deskripsi command'),

  async execute(interaction) {
    await interaction.reply('OK');
  }
};


module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Daftar command bot'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('📖 Help Menu')
      .setColor(0x00ff99)
      .setDescription(`
/cekpingmu - Cek Ping kamu
/help - Daftar command bot
`)
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  }
};
