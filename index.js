// ganz oben einfügen
const express = require('express');
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Bot ist online!");
});

app.listen(port, () => {
  console.log(`Webserver läuft auf Port ${port}`);
});

const { Client, GatewayIntentBits, Partials, MembershipScreeningFieldType } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.once('ready', () => {
  console.log(`Eingeloggt als ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  const content = message.content.toLowerCase();
  const ping = `<@${message.author.id}>`;

  console.log('Nachricht empfangen:', message.content);
  if (message.author.bot) return;

  if (message.content === '!websites') {
    message.channel.send(`
**Webseiten bei Langeweile**
- \`discord.com\` - Discord. Chill, chat und vieles Mehr (Spaß auch, oder?)
- \`google.com\` - Search something
- \`poki.com\` - play online games
- \`slither.io\` - a game (recommended on pc)
- \`evoworld.io\` - It's nice too (mobile 📱✅)

more coming soon
`);
  }

  if (content.includes('hallo') || content.includes('moin')) {
    message.reply(`Hallo ${ping}!`);
  }

  if (content.includes('guten morgen')) {
    message.reply(`Guten Morgen ${ping}!`);
  }

  if (content.includes('guten abend')) {
    message.reply(`Guten Abend ${ping}!`);
  }

  if (content.includes('gute nacht')) {
    message.reply(`Gute Nacht ${ping}!`);
  }

  if (content.includes('kacke') || content.includes('scheiße') || content.includes('scheisse')) {
    message.reply(`Das ist nicht nett ${ping}!`);
    message.delete()
  }

  //if (content.includes('schwör') || content.includes("swear")) {
   // member.timeout(60 * 60 * 1000, 'Schwören ist nd erlaubt')
 // }

  if (content.includes('guten tag')) {
    message.reply(`Guten Tag ${ping}!`);
  }
  
  if (message.content.startsWith('!sag ')) {
    const text = message.content.slice(5); // alles nach "!sag "
    message.channel.send(text);
  }

  if (message.content === '!ping') {
    message.channel.send('Pong!');
  }

  if (message.content === '!wasgeht') {
    message.channel.send('Nichts');
  }

  if (message.content === '!help') {
    message.channel.send(`
📋 **Verfügbare Befehle:**
- \`!wasgeht\` → Sagt "nichts", ist ja nur ein Bot
- \`!ping\` → Antwortet mit "Pong!"
- \`!help\` → Zeigt diese Hilfe
- \`!sag <Text>\` → Wiederholt den Text
- \`!websites\` → Zeigt Webseiten bei Langeweile
- \`!weck <@user> <Zahl>\` → Pingt den @user mehrfach (nur mit bestimmter Rolle)
`);
  }

  if (content.includes("lol") || content.includes("lustig") || content.includes("haha")) {
    try {
      await message.react("😂");
    } catch (error) {
      console.error("Fehler beim Reagieren:", error);
    }
  }

  // !weck-Befehl
  if (message.content.toLowerCase().startsWith("!weck")) {
    if (!message.member) return;

    const erlaubteRollen = ["ADMIN", "👑Moderator", "💎Admin", "🔨Owner"];
    const memberRoles = message.member.roles.cache.map(role => role.name);
    const isAllowed = erlaubteRollen.some(role => memberRoles.includes(role));

    if (!isAllowed) {
      return message.channel.send("🚫 Du hast keine Berechtigung für diesen Befehl.");
    }

    const args = message.content.split(" ");
    const mention = args[1];
    const count = parseInt(args[2]);

    if (!mention || isNaN(count)) {
      return message.channel.send("❌ Verwendung: `!weck @user 3`");
    }

    const userIdMatch = mention.match(/^<@!?(\d+)>$/);
    if (!userIdMatch) {
      return message.channel.send("❌ Bitte @erwähnen Sie den Benutzer richtig.");
    }

    const mentionTag = `<@${userIdMatch[1]}>`;
    const weckCount = Math.min(count, 10);

    for (let i = 0; i < weckCount; i++) {
      await message.channel.send(`${mentionTag} AUFWACHEN! ☀️`);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
