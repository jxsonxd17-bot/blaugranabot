const {
    EmbedBuilder
} = require("discord.js");

module.exports = (client) => {

    client.on("messageCreate", async (message) => {

        if (message.author.bot) return;

        const contenido =
            message.content;

        if (
            contenido !== "!help_live"
        ) return;

        const embed =
            new EmbedBuilder()

            .setColor("#004D98")

            .setTitle("📖 COMANDOS COBERTURA")

            .setDescription(
`Sistema de cobertura multicanal para partidos masculinos y femeninos.`
            )

            .addFields(

{
name: "⚙️ CONFIGURACIÓN",
value:
`🔹 !setup_m
🔹 !setup_f`,
inline: false
},

{
name: "📡 EN VIVO",
value:
`🔹 !live_m
🔹 !live_f`,
inline: false
},

{
name: "🎙️ COMENTARIOS",
value:
`🔹 !comentario_m
🔹 !comentario_f`,
inline: false
},

{
name: "⚽ GOLES",
value:
`🔹 !gol_local_m
🔹 !gol_local_f

🔹 !gol_visitante_m
🔹 !gol_visitante_f`,
inline: false
},

{
name: "🔄 CAMBIOS",
value:
`🔹 !cambio_m
🔹 !cambio_f`,
inline: false
},

{
name: "⏱️ PARTIDO",
value:
`🔹 !ht_m / !ht_f
🔹 !st_m / !st_f
🔹 !ft_m / !ft_f`,
inline: false
},

{
name: "📋 UTILIDADES",
value:
`🔹 !info_m / !info_f
🔹 !reset_m / !reset_f
🔹 !undo_m / !undo_f`,
inline: false
}

)

.setFooter({
text: "La Casa Blaugrana 💙❤️"
})

.setTimestamp();

        return message.channel.send({

            embeds: [embed]

        });

    });

};