const axios = require('axios');

module.exports = (client) => {

    client.on('messageCreate', async message => {

        if (message.author.bot) return;

        if (message.content === '!Barcelona_table') {

            try {

                const response = await axios.get(
                    'https://api.football-data.org/v4/competitions/PD/standings',
                    {
                        headers: {
                            'X-Auth-Token': process.env.FOOTBALL_API
                        }
                    }
                );

                const tabla = response.data.standings[0].table;

                const top10 = tabla.slice(0, 10);

                const standings = top10.map(team => {

    const nombre =
        team.team.name === 'FC Barcelona'
            ? `**${team.team.name}** 🔵🔴`
            : team.team.name;

    return `${team.position}. ${nombre} — ${team.points} pts`;

}).join('\n');

                message.reply({
                    embeds: [
                        {
                            color: 0x004D98,

                            title: '🏆 Tabla de LaLiga',

                            description: standings,

                            footer: {
                                text: 'BlaugranaBot'
                            },

                            timestamp: new Date()
                        }
                    ]
                });

            } catch (error) {

                console.error(error);

                message.reply('❌ Error obteniendo la tabla.');
            }
        }
    });
};