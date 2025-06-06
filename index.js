// Erforderliche Pakete
const express = require("express");
const { Client, GatewayIntentBits, Partials, REST, Routes, SlashCommandBuilder, PermissionsBitField } = require("discord.js");
require("dotenv").config();

// Webserver für 24/7 Betrieb
const app = express();
const port = 3000;
app.get("/", (req, res) => res.send("Bot ist online!"));
app.listen(port, () => console.log(`Webserver läuft auf Port ${port}`));

// Discord Bot Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// Slash Commands definieren
const commands = [
  new SlashCommandBuilder().setName("ping").setDescription("Antwortet mit Pong!"),
  new SlashCommandBuilder().setName("sag").setDescription("Bot sagt deinen Text").addStringOption(opt => opt.setName("text").setDescription("Was soll ich sagen?").setRequired(true)),
  new SlashCommandBuilder().setName("clear").setDescription("Löscht Nachrichten").addIntegerOption(opt => opt.setName("anzahl").setDescription("Anzahl der Nachrichten (1-100)").setRequired(true)),
  new SlashCommandBuilder().setName("websites").setDescription("Zeigt Webseiten gegen Langeweile"),
  new SlashCommandBuilder().setName("weck").setDescription("Pingt einen Benutzer mehrfach").addUserOption(opt => opt.setName("user").setDescription("Wen wecken?").setRequired(true)).addIntegerOption(opt => opt.setName("anzahl").setDescription("Wie oft?").setRequired(true)),
];

// Slash Commands registrieren
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
(async () => {
  try {
    console.log("🔃 Registriere Slash Commands...");
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log("✅ Slash Commands registriert.");
  } catch (error) {
    console.error("Fehler beim Registrieren der Slash Commands:", error);
  }
})();

// Nickname anpassen, wenn Rolle sich ändert oder neues Mitglied
async function setNicknameBasedOnRole(member) {
  const highestRole = member.roles.highest;
  if (highestRole.name === "@everyone") return;
  const newNick = `${highestRole.name} | ${member.user.username}`;
  try {
    await member.setNickname(newNick);
    console.log(`✅ Nickname gesetzt: ${newNick}`);
  } catch (error) {
    console.log(`❌ Fehler beim Setzen des Nicknames für ${member.user.tag}:`, error.message);
  }
}

client.on("guildMemberAdd", async member => setNicknameBasedOnRole(member));
client.on("guildMemberUpdate", async (oldMember, newMember) => {
  if (oldMember.roles.cache.size !== newMember.roles.cache.size) setNicknameBasedOnRole(newMember);
});

// Interaktionen
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === "ping") {
    await interaction.reply("Pong!");
  }

  if (commandName === "sag") {
    const text = interaction.options.getString("text");
    await interaction.reply(text);
  }

  if (commandName === "websites") {
    await interaction.reply(`**Webseiten bei Langeweile**\n- \`discord.com\`\n- \`google.com\`\n- \`poki.com\`\n- \`slither.io\`\n- \`evoworld.io\`\nMehr bald!`);
  }

  if (commandName === "weck") {
    const user = interaction.options.getUser("user");
    const count = interaction.options.getInteger("anzahl");

    const member = interaction.guild.members.cache.get(interaction.user.id);
    const erlaubteRollen = ["ADMIN", "👑Moderator", "💎Admin", "🔨Owner"];
    const hasPermission = member.roles.cache.some(role => erlaubteRollen.includes(role.name));

    if (!hasPermission) return interaction.reply({ content: "🚫 Keine Berechtigung.", ephemeral: true });

    const clampedCount = Math.min(count, 10);
    await interaction.reply(`🛎️ Wecke ${user} ${clampedCount} mal...`);
    for (let i = 0; i < clampedCount; i++) {
      await interaction.channel.send(`${user} AUFWACHEN! ☀️`);
    }
  }

  if (commandName === "clear") {
    const amount = interaction.options.getInteger("anzahl");
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return interaction.reply({ content: "🚫 Keine Berechtigung.", ephemeral: true });
    }

    if (amount < 1 || amount > 100) {
      return interaction.reply("❌ Zahl zwischen 1 und 100 angeben.");
    }

    const deleted = await interaction.channel.bulkDelete(amount, true);
    const reply = await interaction.reply({ content: `🧹 ${deleted.size} Nachrichten gelöscht.`, ephemeral: true });
  }
});

// Bot einloggen
client.once("ready", () => console.log(`✅ Eingeloggt als ${client.user.tag}`));
client.login(process.env.DISCORD_TOKEN);
