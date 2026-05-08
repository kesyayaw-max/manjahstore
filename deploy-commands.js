const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));

  if (!command.data || !command.data.toJSON) {
    console.error(`❌ Ada Command rusak: ${file}`);
    continue;
  }

  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('⏳ memasukan slash commands...');

    await rest.put(
      Routes.applicationGuildCommands(
        '1171688345957572638',
        '1411525531001950292'
      ),
      { body: commands }
    );

    console.log('✅ Slash commands berhasil dimasukan');
  } catch (error) {
    console.error(error);
  }
})();
