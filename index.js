// index.js
require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;

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
  REST,
  Routes,
  SlashCommandBuilder,
  PermissionsBitField,
  Collection,
  Events,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.commands = new Collection();

// Slash-Befehle definieren
const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Antwortet mit Pong!"),

  new SlashCommandBuilder()
    .setName("sag")
    .setDescription("Bot wiederholt deinen Text")
    .addStringOption(option =>
      option.setName("text")
        .setDescription("Der Text, den der Bot sagen soll")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Löscht Nachrichten im Channel")
    .addIntegerOption(option =>
      option.setName("anzahl")
        .setDescription("Anzahl der zu löschenden Nachrichten")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("help")
    .setDescription("Zeigt eine Hilfsübersicht der Befehle."),

  new SlashCommandBuilder()
    .setName("setnick")
    .setDescription("Setzt Nickname basierend auf höchster Rolle."),
].map(command => command.toJSON());

// Slash-Befehle bei Discord registrieren
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("Registriere Slash-Befehle...");
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log("✅ Slash-Befehle registriert!");
  } catch (error) {
    console.error(error);
  }
})();

client.once("ready", () => {
  console.log(`✅ Eingeloggt als ${client.user.tag}`);
});

client.on(Events.GuildMemberAdd, async member => {
  setNicknameBasedOnRole(member);
});

client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
  if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
    setNicknameBasedOnRole(newMember);
  }
});

async function setNicknameBasedOnRole(member) {
  const highestRole = member.roles.highest;
  if (highestRole.name === '@everyone') return;

  const newNick = `${highestRole.name} | ${member.user.username}`;
  try {
    await member.setNickname(newNick);
    console.log(`Nickname für ${member.user.tag} gesetzt: ${newNick}`);
  } catch (error) {
    console.log(`❌ Fehler beim Setzen des Nicknames für ${member.user.tag}:`, error.message);
  }
}

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === "ping") {
    await interaction.reply("Pong!");
  }

  if (commandName === "sag") {
    const text = interaction.options.getString("text");
    await interaction.reply(text);
  }

  if (commandName === "clear") {
    const amount = interaction.options.getInteger("anzahl");

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return interaction.reply({
        content: "🚫 Du hast keine Berechtigung, Nachrichten zu löschen.",
        ephemeral: true,
      });
    }

    try {
      const messages = await interaction.channel.bulkDelete(amount, true);
      const reply = await interaction.reply({ content: `🧹 ${messages.size} Nachrichten gelöscht.`, fetchReply: true });
      setTimeout(() => reply.delete().catch(() => {}), 3000);
    } catch (err) {
      console.error(err);
      interaction.reply("❌ Fehler beim Löschen der Nachrichten.");
    }
  }

  if (commandName === "help") {
    await interaction.reply({
      content: `📋 **Slash-Befehle Übersicht:**\n` +
               `- \`/ping\` → Antwortet mit "Pong!"\n` +
               `- \`/sag <text>\` → Wiederholt den Text\n` +
               `- \`/clear <anzahl>\` → Löscht Nachrichten\n` +
               `- \`/setnick\` → Nickname anpassen`,
      ephemeral: true
    });
  }

  if (commandName === "setnick") {
    const member = interaction.member;
    setNicknameBasedOnRole(member);
    await interaction.reply({ content: "✅ Nickname gesetzt (sofern erlaubt).", ephemeral: true });
  }
});

client.login(process.env.DISCORD_TOKEN);
