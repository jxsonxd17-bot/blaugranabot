// =======================
// COBERTURA MULTICANAL
// =======================

const partidos = {};

// =======================
// CREAR PARTIDO
// =======================

function crearPartido() {

    return {

        torneo: "Sin configurar",
        jornada: "Sin configurar",
        estadio: "Sin configurar",

        local: "Local",
        visitante: "Visitante",

        emojiLocal: "🔵",
        emojiVisitante: "🔴",

        marcadorLocal: 0,
        marcadorVisitante: 0,

        minuto: "0",

        equipoFavorito: "Barcelona",

        eventos: [],
        cambios: []

    };

}

// =======================
// FUNCIONES
// =======================

function header(partido) {

    return `
🏆 | ${partido.torneo}
📆 | ${partido.jornada}
🏟️ | ${partido.estadio}
`;

}

function marcador(partido) {

    return `
${partido.emojiLocal} ${partido.local} | ${partido.marcadorLocal} - ${partido.marcadorVisitante} | ${partido.visitante} ${partido.emojiVisitante}
`;

}

async function enviar(canal, texto, imagen) {

    return canal.send({

        content: texto,

        files:
        imagen
            ? [imagen.url]
            : []

    });

}

// =======================
// EXPORT
// =======================

module.exports = (client) => {

    client.on("messageCreate", async (message) => {

        if (message.author.bot) return;
        if (!message.guild) return;

        const contenido =
            message.content;

        const imagen =
            [...message.attachments.values()][0];

        const canal =
            message.channel;

        const canalID =
            canal.id;

        // =======================
        // CREAR PARTIDO
        // =======================

        if (!partidos[canalID]) {

            partidos[canalID] =
                crearPartido();

        }

        const partido =
            partidos[canalID];

        // =======================
        // SETUP
        // =======================

        if (
            contenido.startsWith("!setup_m") ||
            contenido.startsWith("!setup_f")
        ) {

            const texto =
                contenido
                .replace("!setup_m ", "")
                .replace("!setup_f ", "");

            const datos =
                texto.split(" - ");

            if (datos.length < 8) {

                return message.reply(
`⚠️ Usa:
!setup_m torneo - jornada - estadio - local - visitante - emojiLocal - emojiVisitante - favorito`
                );

            }

            partido.torneo = datos[0];
            partido.jornada = datos[1];
            partido.estadio = datos[2];

            partido.local = datos[3];
            partido.visitante = datos[4];

            partido.emojiLocal = datos[5];
            partido.emojiVisitante = datos[6];

            partido.equipoFavorito = datos[7];

            return message.reply(
`✅ Partido configurado:
${partido.local} vs ${partido.visitante}`
            );

        }

        // =======================
        // INFO
        // =======================

        if (
            contenido === "!info_m" ||
            contenido === "!info_f"
        ) {

            return message.reply(
`
${header(partido)}

${marcador(partido)}
`
            );

        }

        // =======================
        // RESET
        // =======================

        if (
            contenido === "!reset_m" ||
            contenido === "!reset_f"
        ) {

            partido.marcadorLocal = 0;
            partido.marcadorVisitante = 0;

            partido.minuto = "0";

            partido.eventos = [];
            partido.cambios = [];

            return message.reply(
                "✅ Cobertura reiniciada."
            );

        }

        // =======================
        // UNDO
        // =======================

        if (
            contenido === "!undo_m" ||
            contenido === "!undo_f"
        ) {

            partido.eventos.pop();

            return message.reply(
                "↩️ Último evento eliminado."
            );

        }

        // =======================
        // LIVE
        // =======================

        if (
            contenido.startsWith("!live_m") ||
            contenido.startsWith("!live_f")
        ) {

            const args =
                contenido.split(" ");

            const minuto =
                args[1];

            const comentario =
                args.slice(2).join(" ");

            if (!minuto) {

                return message.reply(
                    "⚠️ Usa: !live_m 15 Dominio del Barça"
                );

            }

            partido.minuto = minuto;

            return enviar(

                canal,

`‼️ EN VIVO ‼️

${header(partido)}

⌚ ${partido.minuto}'

${marcador(partido)}

${partido.eventos.join("\n")}

${comentario ? `🔥 ${comentario}` : ""}

@LaCasaBlaugrana💙❤️`,

                imagen

            );

        }

        // =======================
        // COMENTARIO
        // =======================

        if (
            contenido.startsWith("!comentario_m") ||
            contenido.startsWith("!comentario_f")
        ) {

            const args =
                contenido.split(" ");

            const minuto =
                args[1];

            const comentario =
                args.slice(2).join(" ");

            if (
                !minuto ||
                !comentario
            ) {

                return message.reply(
                    "⚠️ Usa: !comentario_m 23 Qué golazo"
                );

            }

            return enviar(

                canal,

`🎙️ Comentario

⌚ ${minuto}'

${comentario}

@LaCasaBlaugrana💙❤️`,

                imagen

            );

        }

        // =======================
        // GOL LOCAL
        // =======================

        if (
            contenido.startsWith("!gol_local_m") ||
            contenido.startsWith("!gol_local_f")
        ) {

            const args =
                contenido.split(" ");

            const goleador =
                args[1];

            const minuto =
                args[2];

            const asistencia =
                args.slice(3).join(" ");

            if (
                !goleador ||
                !minuto
            ) {

                return message.reply(
                    "⚠️ Usa: !gol_local_m Lewandowski 23 Pedri"
                );

            }

            partido.marcadorLocal++;

            partido.eventos.push(
`⚽ ${goleador} ${minuto}' ${partido.emojiLocal}`
            );

            if (asistencia) {

                partido.eventos.push(
`🅰️ ${asistencia}`
                );

            }

            const esFavorito =
                partido.local === partido.equipoFavorito;

            const tituloGol =
            esFavorito

            ? `🚨 GOOOOOOOOOOOOOOOOOL DEL ${partido.local.toUpperCase()} 🚨`

            : `⚽ Gol de ${partido.local}`;

            return enviar(

                canal,

`${tituloGol}

⌚ ${minuto}'

${marcador(partido)}

${partido.eventos.join("\n")}

${esFavorito
? `🔥 ${goleador} marca para ${partido.local}`
: ""}

@LaCasaBlaugrana💙❤️`,

                imagen

            );

        }

        // =======================
        // GOL VISITANTE
        // =======================

        if (
            contenido.startsWith("!gol_visitante_m") ||
            contenido.startsWith("!gol_visitante_f")
        ) {

            const args =
                contenido.split(" ");

            const goleador =
                args[1];

            const minuto =
                args[2];

            if (
                !goleador ||
                !minuto
            ) {

                return message.reply(
                    "⚠️ Usa: !gol_visitante_m Mbappé 45"
                );

            }

            partido.marcadorVisitante++;

            partido.eventos.push(
`⚽ ${goleador} ${minuto}' ${partido.emojiVisitante}`
            );

            const esFavorito =
                partido.visitante === partido.equipoFavorito;

            const tituloGol =
            esFavorito

            ? `🚨 GOOOOOOOOOOOOOOOOOL DEL ${partido.visitante.toUpperCase()} 🚨`

            : `⚽ Gol de ${partido.visitante}`;

            return enviar(

                canal,

`${tituloGol}

⌚ ${minuto}'

${marcador(partido)}

${partido.eventos.join("\n")}

${esFavorito
? `🔥 ${goleador} marca para ${partido.visitante}`
: ""}

@LaCasaBlaugrana💙❤️`,

                imagen

            );

        }

        // =======================
        // CAMBIOS
        // =======================

        if (
            contenido.startsWith("!cambio_m") ||
            contenido.startsWith("!cambio_f")
        ) {

            const texto =
                contenido
                .replace("!cambio_m ", "")
                .replace("!cambio_f ", "");

            const primerEspacio =
                texto.indexOf(" ");

            const minuto =
                texto.slice(0, primerEspacio);

            const cambiosTexto =
                texto.slice(primerEspacio + 1);

            const listaCambios =
                cambiosTexto.split(" / ");

            let resultado = "";

            for (const cambio of listaCambios) {

                const partes =
                    cambio.split(" - ");

                if (partes.length < 2) continue;

                const entra =
                    partes[0];

                const sale =
                    partes[1];

                resultado +=
`⬆️ Entra: ${entra}
⬇️ Sale: ${sale}

`;

            }

            partido.cambios.push(
                resultado.trim()
            );

            return enviar(

                canal,

`🔄 CAMBIOS 🔄

⌚ ${minuto}'

${resultado}

@LaCasaBlaugrana💙❤️`,

                imagen

            );

        }

        // =======================
        // MEDIO TIEMPO
        // =======================

        if (
            contenido.startsWith("!ht_m") ||
            contenido.startsWith("!ht_f")
        ) {

            const comentario =
                contenido
                .replace("!ht_m ", "")
                .replace("!ht_f ", "");

            return enviar(

                canal,

`⏱️ MEDIO TIEMPO ⏱️

${header(partido)}

⌚ HT'

${marcador(partido)}

${partido.eventos.join("\n")}

${comentario}

@LaCasaBlaugrana💙❤️`,

                imagen

            );

        }

        // =======================
        // SEGUNDO TIEMPO
        // =======================

        if (
            contenido.startsWith("!st_m") ||
            contenido.startsWith("!st_f")
        ) {

            const comentario =
                contenido
                .replace("!st_m ", "")
                .replace("!st_f ", "");

            return enviar(

                canal,

`🔥 SEGUNDO TIEMPO 🔥

${header(partido)}

⌚ 46'

${marcador(partido)}

${partido.eventos.join("\n")}

${comentario}

@LaCasaBlaugrana💙❤️`,

                imagen

            );

        }

        // =======================
        // FINAL
        // =======================

        if (
            contenido.startsWith("!ft_m") ||
            contenido.startsWith("!ft_f")
        ) {

            const comentario =
                contenido
                .replace("!ft_m ", "")
                .replace("!ft_f ", "");

            return enviar(

                canal,

`✅ FINALIZADO ✅

${header(partido)}

${marcador(partido)}

${partido.eventos.join("\n")}

${comentario}

@LaCasaBlaugrana💙❤️`,

                imagen

            );

        }

    });

};