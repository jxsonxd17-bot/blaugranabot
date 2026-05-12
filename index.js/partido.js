const axios = require('axios');

module.exports = (client) => {

    client.on('messageCreate', async message => {

        if (message.author.bot) return;

        if (message.content === '!Barcelona_next_match') {

            try {

                const response = await axios.get(
                    'https://api.football-data.org/v4/teams/81/matches?status=SCHEDULED',
                    {
                        headers: {
                            'X-Auth-Token': process.env.FOOTBALL_API
                        }
                    }
                );

                const partido = response.data.matches[0];

                const rival =
                    partido.homeTeam.name === 'FC Barcelona'
                        ? partido.awayTeam.name
                        : partido.homeTeam.name;

                const fecha = new Date(partido.utcDate);

                const fechaFormateada = fecha.toLocaleString('es-ES', {
                    dateStyle: 'full',
                    timeStyle: 'short'
                });

                message.reply({
                    embeds: [
                        {
                            color: 0x004D98,

                            title: '🔵🔴 Próximo partido del Barça',

                            description:
                                `⚽ FC Barcelona vs ${rival}\n\n` +
                                `📅 ${fechaFormateada}`,

                            footer: {
                                text: 'BlaugranaBot'
                            },

                            timestamp: new Date()
                        }
                    ]
                });

            } catch (error) {

                console.error(error);

                message.reply('❌ Error obteniendo el partido.');
            }
        }
    });
};