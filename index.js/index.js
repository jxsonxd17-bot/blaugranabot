require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    Events
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

// Cuando el bot se conecta
client.once(Events.ClientReady, readyClient => {
    console.log(`✅ Bot conectado como ${readyClient.user.tag}`);
});

client.login(process.env.TOKEN);