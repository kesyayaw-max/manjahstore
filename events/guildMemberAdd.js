const { Events } = require('discord.js');

const AUTO_ROLE_ID = '1411525531001950295';

module.exports = {
  name: Events.GuildMemberAdd,

  async execute(member) {
    try {
      const role = member.guild.roles.cache.get(AUTO_ROLE_ID);
      if (!role) return;

      await member.roles.add(role);
      console.log(`✅ Auto role diberikan ke ${member.user.tag}`);
    } catch (err) {
      console.error('❌ Gagal auto role:', err);
    }
  }
};
