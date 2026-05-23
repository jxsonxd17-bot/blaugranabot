// =======================
// COBERTURA MULTICANAL
// =======================

const partidos = {};

// =======================
// CANAL COMANDOS
// =======================

const canalComandosID =
"1493414573603291380";

// =======================
// CANALES COBERTURA
// =======================

const canalMasculinoID =
"1504132193532772542";

const canalFemeninoID =
"1505237014033993739";

// =======================
// DISCORD
// =======================

const {
    EmbedBuilder
} = require("discord.js");

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

    return `🏆 | ${partido.torneo}
📆 | ${partido.jornada}
🏟️ | ${partido.estadio}`;

}

function marcador(partido) {

    return `${partido.emojiLocal} ${partido.local} | ${partido.marcadorLocal} - ${partido.marcadorVisitante} | ${partido.visitante} ${partido.emojiVisitante}`;

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

        // =======================
        // SOLO CANAL COMANDOS
        // =======================

        if (
            message.channel.id !== canalComandosID
        ) return;

        const contenido =
            message.content;

        const imagen =
            [...message.attachments.values()][0];

        // =======================
        // DETECTAR TIPO
        // =======================

        let tipo = null;

        if (
            contenido.includes("_m")
        ) {

            tipo = "m";

        }

        if (
            contenido.includes("_f")
        ) {

            tipo = "f";

        }

        if (!tipo) return;

        // =======================
        // CANAL DESTINO
        // =======================

        const canal =
        tipo === "m"

        ? client.channels.cache.get(
            canalMasculinoID
        )

        : client.channels.cache.get(
            canalFemeninoID
        );

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
            contenido.startsWith(`!setup_${tipo}`)
        ) {

            const texto =
                contenido.replace(
                    `!setup_${tipo} `,
                    ""
                );

            const datos =
                texto.split(" - ");

            if (datos.length < 8) {

                return message.reply(
`⚠️ Usa:
!setup_${tipo} torneo - jornada - estadio - local - visitante - emojiLocal - emojiVisitante - favorito`
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
            contenido === `!info_${tipo}`
        ) {

            return message.reply(
`${header(partido)}

${marcador(partido)}`
            );

        }

        // =======================
        // RESET
        // =======================

        if (
            contenido === `!reset_${tipo}`
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
            contenido === `!undo_${tipo}`
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
            contenido.startsWith(`!live_${tipo}`)
        ) {

            const args =
                contenido.split(" ");

            const minuto =
                args[1];

            const comentario =
                args.slice(2).join(" ");

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
            contenido.startsWith(`!comentario_${tipo}`)
        ) {

            const args =
                contenido.split(" ");

            const minuto =
                args[1];

            const comentario =
                args.slice(2).join(" ");

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
            contenido.startsWith(`!gol_local_${tipo}`)
        ) {

            const args =
                contenido.split(" ");

            const goleador =
                args[1];

            const minuto =
                args[2];

            const asistencia =
                args.slice(3).join(" ");

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

            ? `🚨 GOOOOOOOOOOOOOL DEL ${partido.local.toUpperCase()} 🚨`

            : `⚽ Gol de ${partido.local}`;

            return enviar(

                canal,

`${tituloGol}

⌚ ${minuto}'

${marcador(partido)}

${partido.eventos.join("\n")}

@LaCasaBlaugrana💙❤️`,

                imagen

            );

        }

        // =======================
        // GOL VISITANTE
        // =======================

        if (
            contenido.startsWith(`!gol_visitante_${tipo}`)
        ) {

            const args =
                contenido.split(" ");

            const goleador =
                args[1];

            const minuto =
                args[2];

            partido.marcadorVisitante++;

            partido.eventos.push(
`⚽ ${goleador} ${minuto}' ${partido.emojiVisitante}`
            );

            const esFavorito =
                partido.visitante === partido.equipoFavorito;

            const tituloGol =
            esFavorito

            ? `🚨 GOOOOOOOOOOOOOL DEL ${partido.visitante.toUpperCase()} 🚨`

            : `⚽ Gol de ${partido.visitante}`;

            return enviar(

                canal,

`${tituloGol}

⌚ ${minuto}'

${marcador(partido)}

${partido.eventos.join("\n")}

@LaCasaBlaugrana💙❤️`,

                imagen

            );

        }

        // =======================
        // CAMBIOS
        // =======================

        if (
            contenido.startsWith(`!cambio_${tipo}`)
        ) {

            const texto =
                contenido.replace(
                    `!cambio_${tipo} `,
                    ""
                );

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

                const entra =
                    partes[0];

                const sale =
                    partes[1];

                resultado +=
`⬆️ Entra: ${entra}
⬇️ Sale: ${sale}

`;

            }

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
        // HT
        // =======================

        if (
            contenido.startsWith(`!ht_${tipo}`)
        ) {

            const comentario =
                contenido.replace(
                    `!ht_${tipo} `,
                    ""
                );

            return enviar(

                canal,

`⏱️ MEDIO TIEMPO

${header(partido)}

${marcador(partido)}

${partido.eventos.join("\n")}

${comentario}

@LaCasaBlaugrana💙❤️`,

                imagen

            );

        }

        // =======================
        // ST
        // =======================

        if (
            contenido.startsWith(`!st_${tipo}`)
        ) {

            const comentario =
                contenido.replace(
                    `!st_${tipo} `,
                    ""
                );

            return enviar(

                canal,

`🔥 SEGUNDO TIEMPO

${header(partido)}

${marcador(partido)}

${partido.eventos.join("\n")}

${comentario}

@LaCasaBlaugrana💙❤️`,

                imagen

            );

        }

        // =======================
        // FT
        // =======================

        if (
            contenido.startsWith(`!ft_${tipo}`)
        ) {

            const comentario =
                contenido.replace(
                    `!ft_${tipo} `,
                    ""
                );

            return enviar(

                canal,

`✅ FINALIZADO

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