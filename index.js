require('dotenv').config();
const startWeb = require('./web/server');
const connectDatabase = require('./database/mongoose');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path'); 


//SCHEDULE (ANTI RESTART)
setInterval(async () => {
  const file = path.join(__dirname, 'data/announcements.json');
  if (!fs.existsSync(file)) return;

  const data = JSON.parse(fs.readFileSync(file));
  const now = Date.now();

  const remaining = [];

  for (const a of data) {
    if (now >= a.time) {
      const channel = await client.channels.fetch(a.channelId).catch(() => null);
      if (!channel) continue;

      const msg = await channel.send({
        content: a.ping ? '@everyone' : null,
        embeds: [a.embed]
      });

      if (a.pin) await msg.pin().catch(() => {});
    } else {
      remaining.push(a);
    }
  }

  fs.writeFileSync(file, JSON.stringify(remaining, null, 2));
}, 30_000);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();


// LOAD COMMANDS
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}


// LOAD EVENTS
const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
  const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));

  for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}
//status bot discordnya
client.once('clientReady', () => {
  console.log(`BOT MANJAH READY BOS! ${client.user.tag}`);

  const activities = [
    { name: '🛒 MANJAH STORE!', type: 3 },
    { name: '🎟️ Ticket Support!', type: 2 },
    { name: '📦 Melayani Order!', type: 0 },
    { name: '💬 Fast Respon!', type: 3 },
  ];

  let i = 0;

  setInterval(() => {
    client.user.setActivity(activities[i]);
    i = (i + 1) % activities.length;
  }, 5000); // ganti tiap 5 detik

  client.user.setStatus('online');
});

connectDatabase();
startWeb();
async function startBot() {
  try {
    await client.login(process.env.TOKEN);
    console.log("BOT MANJAH READY BOS!");
  } catch (err) {
    console.error("Discord Gateway Error:", err.message);

    console.log("Reconnect dalam 15 detik...");

    setTimeout(startBot, 15000);
  }
}

startBot();