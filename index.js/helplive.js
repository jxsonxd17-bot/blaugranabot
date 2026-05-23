// =======================
// HELP LIVE
// =======================

const { EmbedBuilder } =
require("discord.js");

if (
    contenido === "!help_live"
) {

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
Configura partido masculino

🔹 !setup_f
Configura partido femenino`,
inline: false
},

{
name: "📡 EN VIVO",
value:
`🔹 !live_m minuto comentario
Cobertura en vivo masculina

🔹 !live_f minuto comentario
Cobertura en vivo femenina`,
inline: false
},

{
name: "🎙️ COMENTARIOS",
value:
`🔹 !comentario_m minuto comentario
Comentario masculino

🔹 !comentario_f minuto comentario
Comentario femenino`,
inline: false
},

{
name: "⚽ GOLES",
value:
`🔹 !gol_local_m jugador minuto asistencia
Gol local masculino

🔹 !gol_local_f jugador minuto asistencia
Gol local femenino

🔹 !gol_visitante_m jugador minuto
Gol visitante masculino

🔹 !gol_visitante_f jugador minuto
Gol visitante femenino`,
inline: false
},

{
name: "🔄 CAMBIOS",
value:
`🔹 !cambio_m minuto entra - sale
Cambios masculinos

🔹 !cambio_f minuto entra - sale
Cambios femeninos

📌 Varios cambios:
entra - sale / entra - sale`,
inline: false
},

{
name: "⏱️ PARTIDO",
value:
`🔹 !ht_m comentario
Medio tiempo masculino

🔹 !ht_f comentario
Medio tiempo femenino

🔹 !st_m comentario
Segundo tiempo masculino

🔹 !st_f comentario
Segundo tiempo femenino

🔹 !ft_m comentario
Final masculino

🔹 !ft_f comentario
Final femenino`,
inline: false
},

{
name: "📋 UTILIDADES",
value:
`🔹 !info_m
Información masculina

🔹 !info_f
Información femenina

🔹 !reset_m
Reinicia cobertura masculina

🔹 !reset_f
Reinicia cobertura femenina

🔹 !undo_m
Elimina último evento masculino

🔹 !undo_f
Elimina último evento femenino`,
inline: false
},

{
name: "📝 EJEMPLOS",
value:
`🔹 !live_m 25 Dominio total del Barça

🔹 !gol_local_m Lewandowski 23 Pedri

🔹 !cambio_m 65 Ferran - Raphinha / Gavi - Pedri`,
inline: false
}

)

.setThumbnail(
client.user.displayAvatarURL()
)

.setFooter({
text: "La Casa Blaugrana 💙❤️"
})

.setTimestamp();

    return canal.send({

        embeds: [embed]

    });

}