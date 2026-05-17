// =======================
// COBERTURA FEMENÍ
// =======================

const canalFemeniID = "1504132193532772542";

// =======================
// VARIABLES
// =======================

let marcadorBarca = 0;
let marcadorAtleti = 0;
let minutoActual = "0";

let eventos = [];
let cambios = [];

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
            client.channels.cache.get(canalFemeniID);

        // =======================
        // LIVE
        // =======================

        if (
            contenido.startsWith("!livef")
        ) {

            const args =
                contenido.split(" ");

            const minuto =
                args[1];

            const resultado =
                args[2];

            const comentario =
                args.slice(3).join(" ");

            if (
                !minuto ||
                !resultado
            ) {

                return message.reply(
                    "⚠️ Usa: !livef 15 1-0 Inició el partido"
                );
            }

            const goles =
                resultado.split("-");

            marcadorBarca =
                parseInt(goles[0]);

            marcadorAtleti =
                parseInt(goles[1]);

            minutoActual = minuto;

            return canal.send({

content:
`‼️ En Vivo ‼️

🏆 |Laliga EA Sports

📆 | Jornada 37

🏟️ | "Spotify Camp Nou"

⌚ ${minutoActual}'

🔵 FC Barcelona | ${marcadorBarca} - ${marcadorAtleti} | Real Betis 🟢

${eventos.join("\n")}

${comentario ? `🔥 ${comentario}\n` : ""}
@LaCasaBlaugrana💙❤️`,

files:
imagen ? [imagen.url] : undefined

            });
        }

        // =======================
        // COMENTARIO
        // =======================

        if (
            contenido.startsWith("!comentario")
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
                    "⚠️ Usa: !comentario 23 Qué golazo"
                );
            }

            return canal.send({

content:
`⌚ ${minuto}'

🎙️ ${comentario}

@LaCasaBlaugrana💙❤️`,

files:
imagen ? [imagen.url] : undefined

            });
        }

        // =======================
        // GOL BARÇA
        // =======================

        if (
            contenido.startsWith("!gol_fcb")
        ) {

            const args =
                contenido.split(" ");

            const goleadora =
                args[1];

            const minuto =
                args[2];

            const asistencia =
                args.slice(3).join(" ");

            if (
                !goleadora ||
                !minuto
            ) {

                return message.reply(
                    "⚠️ Usa: !gol_fcb Aitana 23 Graham"
                );
            }

            marcadorBarca++;

            eventos.push(
`⚽ ${goleadora} ${minuto}' 🔵`
            );

            if (asistencia) {

                eventos.push(
`🅰️ ${asistencia}`
                );
            }

            return canal.send({

content:
`🚨 GOOOOOOOOOL DEL BARÇA 🚨

⌚ ${minuto}'

🔵 FC Barcelona | ${marcadorBarca} - ${marcadorAtleti} | Real Betis 🟢

${eventos.join("\n")}

@LaCasaBlaugrana💙❤️`,

files:
imagen ? [imagen.url] : undefined

            });
        }

        // =======================
        // GOL ATLÉTICO
        // =======================

        if (
            contenido.startsWith("!gol_atm")
        ) {

            const args =
                contenido.split(" ");

            const goleadora =
                args[1];

            const minuto =
                args[2];

            if (
                !goleadora ||
                !minuto
            ) {

                return message.reply(
                    "⚠️ Usa: !gol_atm Gio 45"
                );
            }

            marcadorAtleti++;

            eventos.push(
`⚽ ${goleadora} ${minuto}' 🟢`
            );

            return canal.send({

content:
`⚽ Gol del Betis.

⌚ ${minuto}'

🔵 FC Barcelona | ${marcadorBarca} - ${marcadorAtleti} | Real Betis 🟢

${eventos.join("\n")}

@LaCasaBlaugrana💙❤️`,

files:
imagen ? [imagen.url] : undefined

            });
        }

        // =======================
        // CAMBIOS
        // =======================

        if (
            contenido.startsWith("!cambio")
        ) {

            const texto =
                contenido.replace(
                    "!cambio ",
                    ""
                );

            const listaCambios =
                texto.split(" - ");

            let resultado = "";

            for (const cambio of listaCambios) {

                const partes =
                    cambio.split(" ");

                const entra =
                    partes[0];

                const sale =
                    partes.slice(1).join(" ");

                resultado +=
`⬆️ ${entra}
⬇️ ${sale}

`;
            }

            cambios.push(
                resultado.trim()
            );

            return canal.send({

content:
`🔄 Cambios 🔄

⌚ ${minutoActual}'

${resultado}

@LaCasaBlaugrana💙❤️`,

files:
imagen ? [imagen.url] : undefined

            });
        }

        // =======================
        // MEDIO TIEMPO
        // =======================

        if (
            contenido.startsWith("!ht")
        ) {

            const comentario =
                contenido.replace(
                    "!ht ",
                    ""
                );

            return canal.send({

content:
`⏱️ Medio Tiempo ⏱️

🏆 |Laliga EA Sports

📆 | Jornada 37

🏟️ | "Spotify Camp Nou"

⌚ HT'

🔵 FC Barcelona | ${marcadorBarca} - ${marcadorAtleti} | Real Betis 🟢

${eventos.join("\n")}

${comentario}

@LaCasaBlaugrana💙❤️`,

files:
imagen ? [imagen.url] : undefined

            });
        }

        // =======================
        // SEGUNDO TIEMPO
        // =======================

        if (
            contenido.startsWith("!st")
        ) {

            const comentario =
                contenido.replace(
                    "!st ",
                    ""
                );

            return canal.send({

content:
`🔥 Segundo Tiempo 🔥

🏆 |Laliga EA Sports

📆 | Jornada 37

🏟️ | "Spotify Camp Nou"

⌚ 46'

🔵 FC Barcelona | ${marcadorBarca} - ${marcadorAtleti} | Real Betis 🟢

${eventos.join("\n")}

${comentario}

@LaCasaBlaugrana💙❤️`,

files:
imagen ? [imagen.url] : undefined

            });
        }

        // =======================
        // FINAL
        // =======================

        if (
            contenido.startsWith("!ft")
        ) {

            const comentario =
                contenido.replace(
                    "!ft ",
                    ""
                );

            return canal.send({

content:
`✅ Finalizado ✅

🏆 |Laliga EA Sports

📆 | Jornada 37

🏟️ | "Spotify Camp Nou"

🔵 FC Barcelona | ${marcadorBarca} - ${marcadorAtleti} | Real Betis 🟢

${eventos.join("\n")}

${comentario}

@LaCasaBlaugrana💙❤️`,

files:
imagen ? [imagen.url] : undefined

            });
        }

    });

};