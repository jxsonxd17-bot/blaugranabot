module.exports = (client) => {

    client.on('messageCreate', async message => {

        if (message.author.bot) return;

        if (message.content === '!rata') {

            message.reply({
                embeds: [
                    {
                        color: 0x004D98,

                        title: '🐀 Detectada una rata madridista',

                        image: {
                            url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzoHeqC8X9Ydt-0qfX8AqRyvjHjOYPEjvgmw&s'
                        },

                        footer: {
                            text: 'BlaugranaBot'
                        }
                    }
                ]
            });
        }
    });
};