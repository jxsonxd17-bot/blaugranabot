const {
    Client,
    GatewayIntentBits,
    Partials
} = require("discord.js");

const client = new Client({

    intents: [

        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],

    partials: [
        Partials.Channel
    ]
});

// =======================
// READY
// =======================

client.once("ready", () => {

    console.log(
        `✅ Bot conectado como ${client.user.tag}`
    );

    client.user.setPresence({

        activities: [
            {
                name: "LaCasaBlaugrana 💙❤️"
            }
        ],

        status: "online"
    });
});

// =======================
// COMANDOS
// =======================

const {
    Client,
    GatewayIntentBits,
    Partials
} = require("discord.js");

require("dotenv").config();

const client = new Client({

    intents: [

        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],

    partials: [
        Partials.Channel
    ]
});

// =======================
// READY
// =======================

client.once("ready", () => {

    console.log(
        `✅ Bot conectado como ${client.user.tag}`
    );

    client.user.setPresence({

        activities: [
            {
                name: "LaCasaBlaugrana 💙❤️"
            }
        ],

        status: "online"
    });
});

// =======================
// CARGAR ARCHIVOS
// =======================

require("./anuncio")(client);
require("./bienvenida")(client);
require("./impostor")(client);
require("./live")(client);
require("./partido")(client);
require("./rata")(client);
require("./tabla")(client);

// =======================
// LOGIN
// =======================

client.login(process.env.TOKEN);