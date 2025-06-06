// ganz oben einfügen
const express = require("express");
const app = express();
const port = 3000;
// ganz oben oder vor client.on(...)
function zufallAuswahl(liste) {
  const index = Math.floor(Math.random() * liste.length);
  return liste[index];
}

app.get("/", (req, res) => {
  res.send("Bot ist online!");
});

app.listen(port, () => {
  console.log(`Webserver läuft auf Port ${port}`);
});

const {
  Client,
  GatewayIntentBits,
  Partials,
  MembershipScreeningFieldType,
} = require("discord.js");
const { waitForDebugger } = require("inspector");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.once("ready", () => {
  console.log(`Eingeloggt als ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  const content = message.content.toLowerCase();
  const ping = `<@${message.author.id}>`;

  console.log("Nachricht empfangen:", message.content);
  if (message.author.bot) return;

  if (message.content === "!websites") {
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

  if (content.includes("hallo") || content.includes("moin") || content.includes("hello")) {
    message.reply(`Hallo ${ping}!`);
  }

  if (message.content === "leck") {
    message.reply(`Penis!`);
  }

  if (content.includes("guten morgen")) {
    message.reply(`Guten Morgen ${ping}!`);
  }

  if (content.includes("guten abend")) {
    message.reply(`Guten Abend ${ping}!`);
  }

  if (content.includes("gute nacht")) {
    message.reply(`Gute Nacht ${ping}!`);
  }

  if (
    content.includes("kack") ||
    content.includes("scheiß") ||
    content.includes("scheiss") 
  ) {
    message.reply(`Das ist nicht nett ${ping}!`);
    message.delete();
  }

  if (content.includes('schwör') || content.includes("swear") || content.includes("schwoer")) {
   //member.timeout(60 * 60 * 1000, 'Schwören ist nd erlaubt')
    message.reply('<@&1375861670584258582> <@&1375898789323477032> <@&1375861592444633179> <@&1375861405818949723>'); 
   }

  if (message.content === "!giveawayRobux12345") {
    message.channel.send("Der Preis ist nicht höher als 20 Robux")
  }

  if (message.content === "!skibidi") {
    message.channel.send("/play skibidi toilet")
  }

  if (content.includes("guten tag")) {
    message.reply(`Guten Tag ${ping}!`);
  }

  if (message.content.startsWith("!sag ")) {
    const text = message.content.slice(5); // alles nach "!sag "
    message.channel.send(text);
  }

  if (message.content.startsWith("!anoSag ")) {
    const text = message.content.slice(8); // a
    message.delete();
    message.channel.send(text);
    
  }

  if (content.includes("braver bot")) {
    message.reply("Danke! 😊");
  }

  if (message.content === "!ping") {
    message.channel.send("Pong!");
  }

  if (message.content === "!wasgeht") {
    message.channel.send("Nichts");
  }

  if (message.content === "!help") {
    message.channel.send(`
📋 **Verfügbare Befehle:**
- \`!wasgeht\` → Sagt "nichts", ist ja nur ein Bot
- \`!ping\` → Antwortet mit "Pong!"
- \`!help\` → Zeigt diese Hilfe
- \`!sag <Text>\` → Wiederholt den Text
- \`!websites\` → Zeigt Webseiten bei Langeweile
- \`!weck <@user> <Zahl>\` → Pingt den @user mehrfach (nur mit bestimmter Rolle)
- \`!clear <Nachrichtenanzahl>\` → löscht <Nachrichtenanzahl> mal letzte Nachricht
`);
  }

  if (
    content.includes("lol") ||
    content.includes("lustig") ||
    content.includes("haha")
  ) {
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
    const memberRoles = message.member.roles.cache.map((role) => role.name);
    const isAllowed = erlaubteRollen.some((role) => memberRoles.includes(role));

    if (!isAllowed) {
      return message.channel.send(
        "🚫 Du hast keine Berechtigung für diesen Befehl.",
      );
    }

    const args = message.content.split(" ");
    const mention = args[1];
    const count = parseInt(args[2]);

    if (!mention || isNaN(count)) {
      return message.channel.send("❌ Verwendung: `!weck @user 3`");
    }

    const userIdMatch = mention.match(/^<@!?(\d+)>$/);
    if (!userIdMatch) {
      return message.channel.send(
        "❌ Bitte @erwähnen Sie den Benutzer richtig.",
      );
    }

    const mentionTag = `<@${userIdMatch[1]}>`;
    const weckCount = Math.min(count, 10);

    for (let i = 0; i < weckCount; i++) {
      await message.channel.send(`${mentionTag} AUFWACHEN! ☀️`);
      wait(1000); // 1 Sekunde Pause zwischen den Nachrichten
    }
  }
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  // Beispiel: !clear 5
  if (message.content.startsWith('!clear')) {
    // Überprüfen, ob der Benutzer Berechtigung hat
    if (!message.member.permissions.has('ManageMessages')) {
      return message.reply('🚫 Du hast keine Berechtigung, Nachrichten zu löschen.');
    }

    const args = message.content.split(' ');
    const amount = parseInt(args[1]);

    if (isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply('❌ Bitte gib eine Zahl zwischen 1 und 100 an. Beispiel: `!clear 10`');
    }

    try {
      await message.channel.bulkDelete(amount + 1, true); // +1, um den Befehl selbst auch zu löschen
      const reply = await message.channel.send(`🧹 ${amount} Nachrichten gelöscht.`);
      setTimeout(() => reply.delete().catch(() => {}), 3000); // Antwort automatisch löschen nach 3 Sekunden
    } catch (err) {
      console.error(err);
      message.channel.send('❌ Fehler beim Löschen der Nachrichten.');
    }
  }
});


client.login(process.env.DISCORD_TOKEN);
