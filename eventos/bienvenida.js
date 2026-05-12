module.exports = (client) => {

    client.on('guildMemberAdd', member => {

        const channelId = '1503552116999065782';

        const channel = member.guild.channels.cache.get(channelId);

        if (!channel) return;

        channel.send({
            embeds: [
                {
                    color: 0x004D98,
                    title: '🔵🔴',

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
};