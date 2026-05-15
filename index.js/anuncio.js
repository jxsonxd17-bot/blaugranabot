module.exports = (client) => {

    client.on('messageCreate', async message => {

        if (message.author.bot) return;

        // SOLO ADMINS
        if (!message.member.permissions.has('Administrator')) return;

        // COMANDO
        if (message.content.startsWith('!anuncio')) {

            const anuncio = message.content.slice(9).trim();

            if (!anuncio) {
                return message.reply('❌ Escribe un anuncio.');
            }

            // ID DEL CANAL DE ANUNCIOS
            const canal = client.channels.cache.get('1493418712416518305');

            if (!canal) {
                return message.reply('❌ Canal no encontrado.');
            }

            canal.send(
                `@everyone\n\n` +
                `📢 **NUEVO ANUNCIO** 📢\n\n` +
                `${anuncio}\n\n` +
                `@LaCasaBlaugrana💙❤️`
            );

            message.reply('✅ Anuncio enviado.');
        }
    });
};