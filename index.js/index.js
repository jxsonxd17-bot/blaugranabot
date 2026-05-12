require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    Events
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

require('./bienvenida')(client);
require('./partido')(client);
require('./tabla')(client);
require('./rata')(client);

client.once(Events.ClientReady, readyClient => {

    console.log(`✅ Bot conectado como ${readyClient.user.tag}`);
});

client.login(process.env.TOKEN);