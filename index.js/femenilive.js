// =======================
// COBERTURA FEMENÍ
// =======================

const canalFemeniID = "1505237014033993739";

// =======================
// VARIABLES
// =======================

let marcadorBarca = 0;
let marcadorAtleti = 0;
let minutoActual = "0";

let eventos = [];

// =======================
// EXPORT
// =======================

module.exports = (client) => {

    client.on("messageCreate", async (message) => {

        if (message.author.bot) return;
        if (!message.guild) return;

        if (
            message.channel.id !== canalFemeniID
        ) return;

        const contenido =
            message.content;

        const imagen =
            message.attachments.first();

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

            if (
                !minuto ||
                !resultado
            ) {

                return message.reply(
                    "⚠️ Usa: !livef 15 1-0"
                );
            }

            const goles =
                resultado.split("-");

            marcadorBarca =
                parseInt(goles[0]);

            marcadorAtleti =
                parseInt(goles[1]);

            minutoActual = minuto;

            return message.channel.send({

content:
`‼️ En Vivo ‼️

🏆 | Copa de La Reina 👑

📌 | Final.

🏟️ | Estadio de Gran Canaria.

⌚ ${minutoActual}'

🔵 FC Barcelona | ${marcadorBarca} - ${marcadorAtleti} | Atlético de Madrid 🔴

${eventos.join("\n")}

@LaCasaBlaugrana💙❤️`,

files:
imagen ? [imagen.url] : []

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

            return message.channel.send({

content:
`🚨 GOOOOOOOOOL DEL BARÇA FEMENÍ 🚨

⌚ ${minuto}'

🔵 FC Barcelona | ${marcadorBarca} - ${marcadorAtleti} | Atlético de Madrid 🔴

${eventos.join("\n")}

@LaCasaBlaugrana💙❤️`,

files:
imagen ? [imagen.url] : []

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
`⚽ ${goleadora} ${minuto}' 🔴`
            );

            return message.channel.send({

content:
`⚽ Gol del Atlético de Madrid.

⌚ ${minuto}'

🔵 FC Barcelona | ${marcadorBarca} - ${marcadorAtleti} | Atlético de Madrid 🔴

${eventos.join("\n")}

@LaCasaBlaugrana💙❤️`,

files:
imagen ? [imagen.url] : []

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

            const cambios =
                texto.split(" - ");

            let resultado = "";

            for (const cambio of cambios) {

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

            eventos.push(
resultado.trim()
            );

            return message.channel.send({

content:
`🔄 Cambios 🔄

⌚ ${minutoActual}'

${resultado}

@LaCasaBlaugrana💙❤️`,

files:
imagen ? [imagen.url] : []

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

            return message.channel.send({

content:
`⏱️ Medio Tiempo ⏱️

🏆 | Copa de La Reina 👑

📌 | Final.

🏟️ | Estadio de Gran Canaria.

⌚ HT'

🔵 FC Barcelona | ${marcadorBarca} - ${marcadorAtleti} | Atlético de Madrid 🔴

${eventos.join("\n")}

🔥 ${comentario}

@LaCasaBlaugrana💙❤️`,

files:
imagen ? [imagen.url] : []

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

            return message.channel.send({

content:
`✅ Finalizado ✅

🏆 | Copa de La Reina 👑

📌 | Final.

🏟️ | Estadio de Gran Canaria.

🔵 FC Barcelona | ${marcadorBarca} - ${marcadorAtleti} | Atlético de Madrid 🔴

${eventos.join("\n")}

${comentario}

@LaCasaBlaugrana💙❤️`,

files:
imagen ? [imagen.url] : []

            });
        }

    });

};