module.exports = (client) => {

    client.on('messageCreate', async message => {

        if (message.author.bot) return;

        // SOLO ADMINS
        if (!message.member.permissions.has('Administrator')) return;

        // COMANDO
        if (message.content.startsWith('!anuncio')) {

            const anuncio =
                message.content.slice(9).trim();

            const imagen =
                [...message.attachments.values()][0];

            if (!anuncio && !imagen) {

                return message.reply(
                    '❌ Escribe un anuncio o adjunta una imagen.'
                );
            }

            // ID DEL CANAL DE ANUNCIOS
            const canal =
                client.channels.cache.get(
                    '1493418712416518305'
                );

            if (!canal) {

                return message.reply(
                    '❌ Canal no encontrado.'
                );
            }

            await canal.send({

content:
`@everyone

📢 **NUEVO ANUNCIO** 📢

${anuncio || ""}

@LaCasaBlaugrana💙❤️`,

files:
imagen ? [imagen.url] : []

            });

            return message.reply(
                '✅ Anuncio enviado.'
            );
        }
    });
};