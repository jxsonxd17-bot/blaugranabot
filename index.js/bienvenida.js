module.exports = (client) => {

    client.on('guildMemberAdd', async member => {

        console.log('ALGUIEN ENTRO');

        const channelId = '1503552116999065782';

        const channel = member.guild.channels.cache.get(channelId);

        if (!channel) {
            console.log('NO ENCONTRE EL CANAL');
            return;
        }

        console.log('ENCONTRE EL CANAL');

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