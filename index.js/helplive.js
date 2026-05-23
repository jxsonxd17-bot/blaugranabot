// =======================
// HELP LIVE
// =======================

const {
    EmbedBuilder
} = require("discord.js");

if (
    contenido === "!help_live"
) {

    const embed =
        new EmbedBuilder()

        .setColor("#004D98")

        .setTitle("📖 COMANDOS COBERTURA")

        .setDescription(
`Sistema de cobertura multicentral para partidos masculinos y femeninos.`
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
`🔹 !live_m
Cobertura en vivo masculina

🔹 !live_f
Cobertura en vivo femenina`,
inline: false
},

{
name: "🎙️ COMENTARIOS",
value:
`🔹 !comentario_m
Comentario masculino

🔹 !comentario_f
Comentario femenino`,
inline: false
},

{
name: "⚽ GOLES",
value:
`🔹 !gol_local_m
Gol local masculino

🔹 !gol_local_f
Gol local femenino

🔹 !gol_visitante_m
Gol visitante masculino

🔹 !gol_visitante_f
Gol visitante femenino`,
inline: false
},

{
name: "🔄 CAMBIOS",
value:
`🔹 !cambio_m
Cambios masculinos

🔹 !cambio_f
Cambios femeninos`,
inline: false
},

{
name: "⏱️ PARTIDO",
value:
`🔹 !ht_m / !ht_f
Medio tiempo

🔹 !st_m / !st_f
Segundo tiempo

🔹 !ft_m / !ft_f
Final del partido`,
inline: false
},

{
name: "📋 UTILIDADES",
value:
`🔹 !info_m / !info_f
Información del partido

🔹 !reset_m / !reset_f
Reinicia cobertura

🔹 !undo_m / !undo_f
Elimina último evento`,
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

.setFooter({
text: "La Casa Blaugrana 💙❤️"
})

.setTimestamp();

    return canal.send({

        embeds: [embed]

    });

}