module.exports = (client) => {

    // ID DEL CANAL
    const canalID = '1504132193532772542';

    client.on("messageCreate", async (message) => {

        if (message.author.bot) return;

        // SOLO ADMINS
        if (
            !message.member ||
            !message.member.permissions.has("Administrator")
        ) return;

        // =======================
        // XI FCB
        // =======================

        if (
            message.content.startsWith("!xi")
        ) {

            const rival =
                message.content
                .replace("!xi", "")
                .trim();

            if (!rival) {

                return message.reply(
                    "❌ Escribe el rival."
                );
            }

            const imagen =
                [...message.attachments.values()][0];

            if (!imagen) {

                return message.reply(
                    "❌ Adjunta una imagen."
                );
            }

            const canal =
                client.channels.cache.get(
                    canalID
                );

            if (!canal) {

                return message.reply(
                    "❌ Canal no encontrado."
                );
            }

            await canal.send({

                content:
`📋 | Alineación oficial del FC Barcelona 🔵🔴

⚔️ | Partido ante ${rival}.

💙❤️ @LaCasaBlaugrana`,

                files:
                [imagen.url]

            });

            return message.reply(
                "✅ XI enviado."
            );
        }
    });
};