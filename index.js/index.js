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

// Mensaje de bienvenida
client.on(Events.GuildMemberAdd, member => {

    const channelId = '1503519671180333068';

    const channel = member.guild.channels.cache.get(channelId);

    if (!channel) return;

    channel.send({
        embeds: [
            {
                color: 0x004D98,
                title: "🔵🔴",
                description:
                    `⚡ Bienvenido ${member}\n\n` +
                    `Disfruta tu estancia en la mejor comunidad blaugrana 😎`,
                thumbnail: {
                    url: member.user.displayAvatarURL()
                },
              
                footer: {
                    text: 'La Casa Blaugrana'
                },
                timestamp: new Date()
            }
        ]
    });
});

client.login(process.env.TOKEN);