const axios = require('axios');

module.exports = (client) => {

    const channelId = '1504132193532772542';

    let ultimoEstado = '';
    let ultimoMarcador = '';
    let ultimoMinutoPublicado = -1;

    let imagenInicioMandada = false;
    let imagenSegundoTiempo = false;

    setInterval(async () => {

        try {

            const response = await axios.get(
                'https://api.football-data.org/v4/teams/81/matches?status=LIVE',
                {
                    headers: {
                        'X-Auth-Token': process.env.FOOTBALL_API
                    }
                }
            );

            const partido = response.data.matches[0];

            if (!partido) return;

            const canal = await client.channels.fetch(channelId);

            if (!canal) return;

            const estado = partido.status;

            const local = partido.homeTeam.name;
            const visitante = partido.awayTeam.name;

            const golesLocal = partido.score.current.home ?? 0;
            const golesVisitante = partido.score.current.away ?? 0;

            const minuto = partido.minute || 0;

            const marcadorActual =
                `${golesLocal}-${golesVisitante}`;

            // =======================
            // INICIO DEL PARTIDO
            // =======================

            if (
                estado === 'IN_PLAY' &&
                ultimoEstado !== 'IN_PLAY'
            ) {

                await canal.send({

content:
`‼️ **En Vivo** ‼️

🏆 | Laliga EA Sports 🇪🇸

📆 | Jornada 37.

🏟️ | "Spotify Camp Nou", Les Corts, Barcelona, España.

⌚️ | ¡Comenzó el partido!

🔵 ${local} | 0️⃣ - 0️⃣ | ${visitante} 🟢

@LaCasaBlaugrana💙❤️`,

files:
!imagenInicioMandada
? [
"https://media.discordapp.net/attachments/1493414573603291380/1505638598219923557/Inicio_20260517132941.png?ex=6a0b5ab7&is=6a0a0937&hm=09d7607e4ab43b74237abb4bb62272d6a2523c75f49f62060f0f755184751b12&=&format=webp&quality=lossless&width=621&height=777"
]
: []

                });

                imagenInicioMandada = true;
            }

            // =======================
            // GOLES
            // =======================

            if (
                marcadorActual !== ultimoMarcador &&
                ultimoMarcador !== ''
            ) {

                const barcaMarco =

                    (
                        local === 'FC Barcelona' &&
                        golesLocal >
                        parseInt(
                            ultimoMarcador.split('-')[0]
                        )
                    )

                    ||

                    (
                        visitante === 'FC Barcelona' &&
                        golesVisitante >
                        parseInt(
                            ultimoMarcador.split('-')[1]
                        )
                    );

                if (barcaMarco) {

                    await canal.send(
`🚨 **GOOOOOOOOOOL DEL BARÇA** 🚨

⌚️ ${minuto}'

🔵 ${local} | ${golesLocal}️⃣ - ${golesVisitante}️⃣ | ${visitante} 🟢

@LaCasaBlaugrana💙❤️`
                    );

                } else {

                    await canal.send(
`⚽ Gol del rival.

⌚️ ${minuto}'

🔵 ${local} | ${golesLocal}️⃣ - ${golesVisitante}️⃣ | ${visitante} 🟢

@LaCasaBlaugrana💙❤️`
                    );
                }
            }

            // =======================
            // CADA 15 MINUTOS
            // =======================

            const bloques =
                [15, 30, 45, 60, 75, 90];

            if (
                bloques.includes(minuto) &&
                ultimoMinutoPublicado !== minuto
            ) {

                await canal.send(
`‼️ **En Vivo** ‼️

🏆 | Laliga EA Sports 🇪🇸

📆 | Jornada 37.

🏟️ | "Spotify Camp Nou", Les Corts, Barcelona, España.

⌚️ ${minuto}'

🔵 ${local} | ${golesLocal}️⃣ - ${golesVisitante}️⃣ | ${visitante} 🟢

@LaCasaBlaugrana💙❤️`
                );

                ultimoMinutoPublicado = minuto;
            }

            // =======================
            // MEDIO TIEMPO
            // =======================

            if (
                estado === 'PAUSED' &&
                ultimoEstado !== 'PAUSED'
            ) {

                await canal.send(
`⏱️ **MEDIO TIEMPO** ⏱️

🏆 | Laliga EA Sports 🇪🇸

📆 | Jornada 37.

🏟️ | "Spotify Camp Nou", Les Corts, Barcelona, España.

🔵 ${local} | ${golesLocal}️⃣ - ${golesVisitante}️⃣ | ${visitante} 🟢

@LaCasaBlaugrana💙❤️`
                );
            }

            // =======================
            // SEGUNDO TIEMPO
            // =======================

            if (
                estado === 'IN_PLAY' &&
                ultimoEstado === 'PAUSED' &&
                !imagenSegundoTiempo
            ) {

                await canal.send({

content:
`🔥 ¡COMENZÓ EL SEGUNDO TIEMPO!

🔵 ${local} | ${golesLocal}️⃣ - ${golesVisitante}️⃣ | ${visitante} 🟢

@LaCasaBlaugrana💙❤️`,

files:
[
"https://media.discordapp.net/attachments/1493414573603291380/1505638598219923557/Inicio_20260517132941.png?ex=6a0b5ab7&is=6a0a0937&hm=09d7607e4ab43b74237abb4bb62272d6a2523c75f49f62060f0f755184751b12&=&format=webp&quality=lossless&width=621&height=777"
]

                });

                imagenSegundoTiempo = true;
            }

            // =======================
            // FINAL
            // =======================

            if (
                estado === 'FINISHED' &&
                ultimoEstado !== 'FINISHED'
            ) {

                await canal.send(
`✅ **FINAL DEL PARTIDO** ✅

🏆 | Laliga EA Sports 🇪🇸

📆 | Jornada 37.

🏟️ | "Spotify Camp Nou", Les Corts, Barcelona, España.

🔵 ${local} | ${golesLocal}️⃣ - ${golesVisitante}️⃣ | ${visitante} ⚪

@LaCasaBlaugrana💙❤️`
                );

                // RESETEAR

                imagenInicioMandada = false;
                imagenSegundoTiempo = false;
            }

            ultimoEstado = estado;
            ultimoMarcador = marcadorActual;

        } catch (error) {

            console.error(error);
        }

    }, 60000);

};