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
                            'X-Auth-Token': '7eb2e267c6b04b6dab6faf333ca3783c'
                        }
                    }
                );

                const partido = response.data.matches[0];

                const rival =
                    partido.homeTeam.name === 'FC Barcelona'
                        ? partido.awayTeam.name
                        : partido.homeTeam.name;

                message.reply({
                    embeds: [
                        {
                            color: 0x004D98,

                            title: '🔵🔴 Próximo partido del Barça',

                            description:
                                `⚽ FC Barcelona vs ${rival}\n\n` +
                                `📅 ${partido.utcDate}`,

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