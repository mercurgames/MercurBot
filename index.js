// index.js

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
  ButtonBuilder,
  ChannelType,
  ButtonStyle,
  ActionRowBuilder,
  PermissionsBitField,
  Collection,
  Events,
  EmbedBuilder,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.commands = new Collection();

client.once("ready", async () => {
  console.log(`✅ Eingeloggt als ${client.user.tag}`);

  // Slash-Commands definieren
  const commands = [
    new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Zeigt Pong!"),

    new SlashCommandBuilder()
      .setName("new")
      .setDescription("Im Namen wird gesagt, das es was Neues gibt"),

    new SlashCommandBuilder()
      .setName("lock")
      .setDescription("Im Kanal werden keine Nachrichten verschickt"),

    new SlashCommandBuilder()
      .setName("unlock")
      .setDescription("Im Kanal können Nachrichten verschickt werden"),
	  
    new SlashCommandBuilder()
      .setName("sag")
      .setDescription("Lässt den Bot etwas sagen")
      .addStringOption(option =>
        option
          .setName("text")
          .setDescription("Was soll der Bot sagen?")
          .setRequired(true)
      ),

	new SlashCommandBuilder()
  .setName("webhookmsg")
  .setDescription("Sendet eine Nachricht über einen Webhook")
  .addStringOption(option =>
    option.setName("nachricht")
      .setDescription("Was soll gesendet werden?")
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName("avatar")
      .setDescription("Avatar-URL (optional)")
      .setRequired(false)
  )
  .addStringOption(option =>
    option.setName("name")
      .setDescription("Profilname (optional)")
      .setRequired(false)
  ),

	  

	new SlashCommandBuilder()
 	 .setName("mentionrole")
 	 .setDescription("Erwähnt eine Rolle ohne Benachrichtigung")
 	 .addRoleOption(option =>
 	   option.setName("rolle")
 	     .setDescription("Welche Rolle soll erwähnt werden?")
  	    .setRequired(true)
  	),

		
    new SlashCommandBuilder()
      .setName("help")
      .setDescription("Zeigt alle Slash Commands"),
    
    new SlashCommandBuilder()
      .setName("clear")
      .setDescription("Löscht Nachrichten")
      .addIntegerOption(option =>
        option
          .setName("anzahl")
          .setDescription("Anzahl der Nachrichten (1-100)")
          .setRequired(true)
      ),
      new SlashCommandBuilder()
 			 .setName("dm")
  .setDescription("Sendet einem User eine DM")
  .addUserOption(option =>
    option
      .setName("user")
      .setDescription("Wem soll ich schreiben?")
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName("nachricht")
      .setDescription("Was soll ich sagen?")
      .setRequired(true)
  ),

    new SlashCommandBuilder()
      .setName("weck")
      .setDescription("Spammt jemanden wach")
      .addUserOption(option =>
        option
          .setName("user")
          .setDescription("Wen willst du wecken?")
          .setRequired(true)
      )
      .addIntegerOption(option =>
        option
          .setName("anzahl")
          .setDescription("Wie oft?")
          .setMinValue(1)
          .setMaxValue(10)
          .setRequired(true)
      ),

    new SlashCommandBuilder()
      .setName("websites")
      .setDescription("Zeigt Websites gegen Langeweile"),

    new SlashCommandBuilder()
      .setName("setnick")
      .setDescription("Setzt dein Nickname basierend auf der höchsten Rolle")
  ].map(cmd => cmd.toJSON());

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

  try {
    console.log("📨 Registriere Slash-Commands...");
    console.time("Slash-Commands Registrierung");
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    console.timeEnd("Slash-Commands Registrierung");

    console.log("✅ Slash-Commands registriert!");
  } catch (error) {
    console.error(`❌ Fehler beim Registrieren der Slash-Commands:`, error);
  }
});

client.on(Events.GuildMemberRemove, async member => {
    const channelIDs = ["1382686427858341898", "1387129688962629756", "1394390181812899881", "1403343107537244286", "1403416086249996507"]; // Liste der IDs

    for (const channelID of channelIDs) {
        const channel = member.guild.channels.cache.get(channelID);
        if (!channel) continue; // Falls der Kanal nicht existiert, überspringen

        const goodbyeEmbed = new EmbedBuilder()
            .setColor("#ff0000")
            .setTitle("Auf Wiedersehen!")
            .setDescription(`👋 ${member.user} hat **${member.guild.name}** verlassen.`)
            .setThumbnail(member.user.displayAvatarURL());

        channel.send({ embeds: [goodbyeEmbed] });
    }
});


client.on(Events.GuildMemberAdd, async member => {
  // Versuche, die Rolle "Member" zu vergeben
  const role = member.guild.roles.cache.find(r => r.name === "Member");
  if (role) {
    try {
      await member.roles.add(role);
      console.log(`✅ Rolle "Member" an ${member.user.tag} vergeben.`);
    } catch (error) {
      console.error(`❌ Fehler beim Vergeben der Rolle an ${member.user.tag}:`, error.message);
    }
  } else {
    console.warn(`⚠️ Rolle "Member" wurde nicht gefunden.`);
  }

  //const channel = member.guild.channels.cache.get("1382401900313448449"); // Kanal-ID einfügen
    const channelIDs = ["1382401900313448449", "1403416086249996507", "1403343107537244285","1381259431555239966", "1375181656993824939", "1383405232461054034", "1383468222002626660", "1384965756286144754", "1387129646197244034", "1376163763060867155", "1394390128692039700"]; // Füge hier weitere Kanal-IDs hinzu

    for (const channelID of channelIDs) {
        const channel = member.guild.channels.cache.get(channelID);
        if (!channel) {
            console.error(`❌ Fehler: Kanal mit ID ${channelID} nicht gefunden.`);
            continue;
        }

        const welcomeEmbed = new EmbedBuilder()
            .setColor("#00ff00")
            .setTitle("Willkommen!")
            .setDescription(`👋 Hey ${member.user}, willkommen auf unserem Server!`)
            .setThumbnail(member.user.displayAvatarURL());

        channel.send({ embeds: [welcomeEmbed] });
    }
  
  // Nickname automatisch setzen
  setImmediate(() => setNicknameBasedOnRole(member));

});


client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
  if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
    setNicknameBasedOnRole(newMember);
  }
});


async function setNicknameBasedOnRole(member) {
    const displayName = member.displayName;

    // Filtere sinnvolle Rollen
    const role = member.roles.cache
        .filter(r => r.name !== '@everyone')
        .sort((a, b) => b.position - a.position)
        .find(r => r.name !== displayName); // vermeide Rollen, die gleich sind wie Name

    if (!role) return;

    // Entferne Emojis & Trennzeichen
    const raw = role.name;
    const cleaned = raw
        .split(/[\|┃➤«»▪・>]/)
        .map(part => part.trim())
        .find(part => part.length > 2); // z.B. "Mod" aus "🎮 | Mod"

    const roleName = cleaned || raw;

    // Falls der Name den Rollennamen schon enthält → nicht anhängen
    const containsRole = displayName.toLowerCase().includes(roleName.toLowerCase());
    const finalNick = containsRole ? displayName : `${roleName} | ${displayName}`;

    member.setNickname(finalNick.slice(0, 32)).catch(err => {
        console.error(`❌ Fehler beim Nickname-Setzen für ${member.user.tag}:`, err.message);
    });
}



client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === "ping") {
    await interaction.deferReply();
    await interaction.editReply("Pong!");
  }

  // if (commandName === "slowcmd") {
  //       await interaction.deferReply(); // Antwort verzögern

  //       // Simulierte lange Verarbeitung (z. B. API-Anfrage)
  //       await new Promise(resolve => setTimeout(resolve, 5000));

  //       await interaction.editReply("✅ Verarbeitung abgeschlossen!");
  // }

  if (commandName === "sag") {
    const text = interaction.options.getString("text");
    await interaction.deferReply();
    await interaction.editReply(text);
  }

	if (interaction.commandName === "webhookmsg") {
    const nachricht = interaction.options.getString("nachricht");
    const avatar = interaction.options.getString("avatar") || undefined;
    const name = interaction.options.getString("name") || undefined;

    const channel = interaction.channel;

    // Webhook suchen
    let webhook = (await channel.fetchWebhooks())
        .find(hook => hook.name.toLowerCase().includes("merkurhook"));

    // Falls keiner existiert → erstelle einen
    if (!webhook) {
        try {
            webhook = await channel.createWebhook({
                name: "MerkurHook",
                avatar: interaction.client.user.displayAvatarURL()
            });
        } catch (err) {
            console.error("❌ Fehler beim Erstellen des Webhooks:", err);
            return interaction.reply({
                content: "🚫 Webhook konnte nicht erstellt werden.",
                ephemeral: true
            });
        }
    }

    // Nachricht senden
    try {
        await webhook.send({
            content: nachricht,
            username: name || "MerkurHook",
            avatarURL: avatar || interaction.client.user.displayAvatarURL()
        });

        await interaction.reply({
            content: "✅ Nachricht wurde über den Webhook gesendet.",
            ephemeral: true
        });
    } catch (error) {
        console.error("❌ Fehler beim Senden über Webhook:", error);
        await interaction.reply({
            content: "❌ Fehler beim Webhook-Versand.",
            ephemeral: true
        });
    }
}



if (interaction.commandName === "mentionrole") {
    const role = interaction.options.getRole("rolle");

    // Berechtigung prüfen (optional)
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.SendMessages)) {
        return interaction.reply({
            content: "🚫 Du darfst keine Nachrichten senden.",
            ephemeral: true
        });
    }

    try {
        await interaction.deferReply({
            content: `<@&${role.id}>`,
            allowedMentions: { roles: [] }, // verhindert Ping
            ephemeral: false
        });
    } catch (error) {
        console.error("❌ Fehler beim Erwähnen der Rolle:", error);
        await interaction.reply({
            content: "❌ Konnte die Rolle nicht erwähnen.",
            ephemeral: true
        });
    }
}

	
  if (commandName === "clear") {
    const amount = interaction.options.getInteger("anzahl");

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return interaction.deferReply({
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

if (interaction.commandName === "new") {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        return interaction.reply({
            content: "🚫 Du brauchst die Berechtigung **Kanal verwalten**, um diesen Befehl zu nutzen.",
            ephemeral: true
        });
    }

    const channel = interaction.channel;
    const prefix = "❗new❗";

    let newName;
    if (channel.name.startsWith(prefix)) {
        // Entferne das Präfix
        newName = channel.name.slice(prefix.length);
    } else {
        // Füge das Präfix hinzu
        newName = `${prefix}${channel.name}`;
    }

    try {
        await interaction.deferReply({ ephemeral: true }); // Interaktion sichern
        await channel.setName(newName);
        await interaction.editReply(`✅ Kanalname wurde geändert zu **${newName}**.`);
    } catch (error) {
        console.error(error);
        if (!interaction.replied) {
            await interaction.editReply("❌ Fehler beim Ändern des Kanalnamens.");
        }
    }
}


if (interaction.commandName === "lock") {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        return interaction.reply({
            content: "🚫 Du brauchst die Berechtigung **Kanal verwalten**, um diesen Befehl zu nutzen.",
            ephemeral: true
        });
    }

    const channel = interaction.channel;
    const everyoneRole = interaction.guild.roles.everyone;

    try {
        await channel.permissionOverwrites.edit(everyoneRole, {
            SendMessages: false,
            SendMessagesInThreads: false,
            CreatePublicThreads: false,
            CreatePrivateThreads: false,
        });

        await interaction.reply({ content: "🔒 Kanal wurde erfolgreich für @everyone gesperrt.", ephemeral: false });
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: "❌ Fehler beim Sperren des Kanals.", ephemeral: true });
    }
}

if (commandName === "dm") {
  const erlaubteUser = [
    "1251600600164991099" // deine eigene ID z. B.
  ];

  if (!erlaubteUser.includes(interaction.user.id)) {
    return interaction.reply({
      content: "🚫 Du darfst diesen Befehl nicht verwenden.",
      ephemeral: true
    });
  }

  const targetUser = interaction.options.getUser("user");
  const message = interaction.options.getString("nachricht");

  try {
    await targetUser.send(`${message}`);
    await interaction.reply({ content: "✅ DM wurde gesendet.", ephemeral: true });
  } catch (error) {
    console.error("DM-Fehler:", error);
    await interaction.reply({ content: "❌ Konnte keine DM senden. Hat der User DMs deaktiviert?", ephemeral: true });
  }
}

if (interaction.commandName === "unlock") {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        return interaction.reply({
            content: "🚫 Du brauchst die Berechtigung **Kanal verwalten**, um diesen Befehl zu nutzen.",
            ephemeral: true
        });
    }

    const channel = interaction.channel;
    const everyoneRole = interaction.guild.roles.everyone;

    try {
        await channel.permissionOverwrites.edit(everyoneRole, {
            SendMessages: null,
            SendMessagesInThreads: null,
            CreatePublicThreads: null,
            CreatePrivateThreads: null,
        });

        await interaction.reply({ content: "🔓 Kanal wurde erfolgreich für @everyone freigegeben.", ephemeral: false });
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: "❌ Fehler beim Freigeben des Kanals.", ephemeral: true });
    }
}

	
  if (commandName === "help") {
    const authButton = new ButtonBuilder()
    	.setLabel("🔗 MercurBot autorisieren")
    	.setStyle(ButtonStyle.Link)
    	.setURL("https://discord.com/oauth2/authorize?client_id=1373628559549272165&response_type=code&redirect_uri=https%3A%2F%2Fgoogle.com&scope=identify+guilds.join");

    const row = new ActionRowBuilder().addComponents(authButton);
	  
    await interaction.deferReply({ ephemeral: false });
    await interaction.editReply({
    content: `📋 **Slash-Befehle Übersicht:**\n` +
        `- \`/ping\` → Antwortet mit "Pong!"\n` +
        `- \`/sag <text>\` → Wiederholt den Text\n` +
        `- \`/clear <anzahl>\` → Löscht Nachrichten\n` +
        `- \`/setnick\` → Nickname anpassen\n` +
        `- \`/webhookmsg\` -> Sendet eine Nachricht über einen Webhook in diesem Kanal. Webhook wird automatisch erstellt \n` +
	`- \`/websites\` → Zeigt Websites gegen Langweile\n` +
        `Commands gemacht von <@1251600600164991099>\n` +
	`Autorisieren:`,
	components: [row],
});

  }

  if (commandName === "setnick") {
    await interaction.deferReply({ ephemeral: true });

    const member = interaction.guild.members.cache.get(interaction.user.id); // User abrufen
    if (!member) return interaction.editReply("❌ Fehler: Benutzer nicht gefunden.");

    try {
        setNicknameBasedOnRole(member); // Funktion korrekt aufrufen
        await interaction.editReply("✅ Nickname gesetzt (sofern erlaubt).");
    } catch (error) {
        console.error("❌ Fehler beim Ändern des Nicknames:", error);
        await interaction.editReply("❌ Fehler: Nickname konnte nicht geändert werden.");
    }
  }

  if (commandName === "weck") {
    const allowedRoles = ["ADMIN", "Moderator", "Wecker"]; // Erlaubte Rollen
    const memberRoles = interaction.member.roles.cache.map(role => role.name);

    // Prüfen, ob der Nutzer eine erlaubte Rolle hat
    if (!allowedRoles.some(role => memberRoles.includes(role))) {
        return interaction.reply({ content: "🚫 Du hast keine Berechtigung, diesen Befehl zu nutzen.", ephemeral: true });
    }

    await interaction.deferReply();
    const user = interaction.options.getUser("user");
    const anzahl = interaction.options.getInteger("anzahl");
    const emoji = '<:pepebed:1405206839553036420>'; // Format: <:name:id>
    for (let i = 0; i < anzahl; i++) {
        await interaction.channel.send(`${user} AUFWACHEN! ☀️ ${emoji}`);
		
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await interaction.editReply(`✅ ${user} wurde ${anzahl} Mal geweckt!`);
}


  if (commandName === "websites") {
    await interaction.deferReply();
    await interaction.editReply(`
**🌐 Webseiten gegen Langeweile**
- \`discord.com\` – Discord selbst 😄
- \`google.com\` – Googeln geht immer!
- \`poki.com\` – Spiele ohne Anmeldung
- \`slither.io\` – Klassiker
- \`evoworld.io\` – Mobile Game für zwischendurch
`);
  }
});

client.on("messageCreate", async (message) => {
  const content = message.content.toLowerCase();
  const ping = `<@${message.author.id}>`;
  

  console.log("Nachricht empfangen:", message.content);
  if (message.author.bot) return;


  if (content.includes("hallo") || content.includes("moin") || content.includes("hello")){
    message.reply(`Hallo ${ping}!`);
  }

  if (message.content === "leck") {
    message.reply(`Penis!`);
  }
  
  if (content.includes("<@1373628559549272165>")){
    message.reply(`Was?`)
  }
  
  if (content.includes("guten morgen")) {
    message.reply(`Guten Morgen ${ping} <:pepebed:1405206839553036420>!`); //<--Pepebed hier
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
    content.includes("scheiss") ||
    content.includes("kaka") ||
    content.includes("fick") ||
    content.includes("fuck") 
  ) {
    message.reply(`Das ist nicht nett ${ping}!`);
    setTimeout(() => message.delete(), 500); // 1 Sekunde Verzögerung

  }
  if (content.includes("guten tag")) {
    message.reply(`Guten Tag ${ping}!`);
  }
  if (content.includes("braver bot")) {
    message.reply("Danke! 😊");
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
});

client.on("messageCreate", async message => {
  // Ignoriere Nachrichten von Bots oder Nachrichten außerhalb von DMs
  if (message.author.bot || message.channel.type !== ChannelType.DM) return;
  console.log("Jemand hat mich dmt");
  // Deine Discord User-ID (als Bot-Empfänger)
  const ownerId = "1251600600164991099"; // z. B. "123456789012345678"
  const owner = await client.users.fetch(ownerId);

  // Nachricht weiterleiten
	try {
  await owner.send(`📩 Neue DM von ${message.author.id}:\n${message.content}`);
  } catch(error) {
    console.error("Fehler beim Weiterleiten einer DM: ",error);
  }
});


app.get("/discord/callback", async (req, res) => {
  const axios = require("axios");
  const code = req.query.code;

  try {
    // 1. Token tauschen
    const tokenRes = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
      client_id: '1373628559549272165',
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'https://mercur-shop.mysellauth.com/discord/callback',
      scope: 'identify guilds.join'
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const accessToken = tokenRes.data.access_token;

    // 2. Nutzerinformationen abrufen
    const userRes = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const userId = userRes.data.id;

    // 3. Nutzer dem Server hinzufügen
    await axios.put(`https://discord.com/api/guilds/1382397412559290519/members/${userId}`, {
      access_token: accessToken
    }, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    res.send("✅ Du wurdest erfolgreich auf den Discord-Server hinzugefügt!");
  } catch (err) {
    console.error("❌ Fehler beim Hinzufügen:", err.response?.data || err.message);
    res.status(500).send("Ein Fehler ist aufgetreten.");
  }
});



client.login(process.env.DISCORD_TOKEN);
