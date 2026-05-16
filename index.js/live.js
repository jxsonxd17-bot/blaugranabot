const axios = require('axios');

module.exports = (client) => {

    const channelId = '1504132193532772542';

    let ultimoEstado = '';
    let ultimoMarcador = '';
    let ultimoMinutoPublicado = -1;

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

            const marcadorActual = `${golesLocal}-${golesVisitante}`;

            // INICIO DEL PARTIDO
            if (estado === 'IN_PLAY' && ultimoEstado !== 'IN_PLAY') {

                canal.send(
                    `‼️ **En Vivo** ‼️\n\n` +
                    `🏆 | Laliga EA Sports\n\n` +
                    `📆 | Jornada 37.\n\n` +
                    `🏟️ | "Spotify Camp Nou", Les Corts, Barcelona, España\n\n` +
                    `⌚️ | ¡Comenzó el partido!\n\n` +
                    `🔵 ${local} | 0️⃣ - 0️⃣ | ${visitante} 🟢\n\n` +
                    `@LaCasaBlaugrana💙❤️`
                );
            }

            // GOLES
if (marcadorActual !== ultimoMarcador && ultimoMarcador !== '') {

    const barcaMarco =
        (local === 'FC Barcelona' && golesLocal > parseInt(ultimoMarcador.split('-')[0])) ||

        (visitante === 'FC Barcelona' && golesVisitante > parseInt(ultimoMarcador.split('-')[1]));

    if (barcaMarco) {

        canal.send(
            `🚨 **GOOOOOOOOOOL DEL BARÇA** 🚨\n\n` +
            `⌚️ ${minuto}'\n\n` +
            `🔵 ${local} | ${golesLocal}️⃣ - ${golesVisitante}️⃣ | ${visitante} 🟢\n\n` +
            `@LaCasaBlaugrana💙❤️`
        );

    } else {

        canal.send(
            `⚽ Gol del Betis.\n\n` +
            `⌚️ ${minuto}'\n\n` +
            `🔵 ${local} | ${golesLocal}️⃣ - ${golesVisitante}️⃣ | ${visitante} 🟢\n\n` +
            `@LaCasaBlaugrana💙❤️`
        );
    }
}

            // CADA 15 MINUTOS
            const bloques = [15, 30, 45, 60, 75, 90];

            if (
                bloques.includes(minuto) &&
                ultimoMinutoPublicado !== minuto
            ) {

                canal.send(
                    `‼️ **En Vivo** ‼️\n\n` +
                    `🏆 | Laliga EA Sports\n\n` +
                    `📆 | Jornada 37.\n\n` +
                    `🏟️ | "Spotify Camp Nou", Les Corts, Barcelona, España\n\n` +
                    `⌚️ ${minuto}'\n\n` +
                    `🔵 ${local} | ${golesLocal}️⃣ - ${golesVisitante}️⃣ | ${visitante} 🟢\n\n` +
                    `@LaCasaBlaugrana💙❤️`
                );

                ultimoMinutoPublicado = minuto;
            }

            // MEDIO TIEMPO
            if (estado === 'PAUSED' && ultimoEstado !== 'PAUSED') {

                canal.send(
                    `⏱️ **MEDIO TIEMPO** ⏱️\n\n` +
                    `🏆 | Laliga EA Sports\n\n` +
                    `📆 | Jornada 37.\n\n` +
                    `🏟️ | "Spotify Camp Nou", Les Corts, Barcelona, España\n\n` +
                    `🔵 ${local} | ${golesLocal}️⃣ - ${golesVisitante}️⃣ | ${visitante} 🟢\n\n` +
                    `@LaCasaBlaugrana💙❤️`
                );
            }

            // FINAL
            if (estado === 'FINISHED' && ultimoEstado !== 'FINISHED') {

                canal.send(
                    `✅ **FINAL DEL PARTIDO** ✅\n\n` +
                    `🏆 | Laliga EA Sports\n\n` +
                    `📆 | Jornada 37.\n\n` +
                    `🏟️ | "Spotify Camp Nou", Les Corts, Barcelona, España\n\n` +
                    `🔵 ${local} | ${golesLocal}️⃣ - ${golesVisitante}️⃣ | ${visitante} 🟢\n\n` +
                    `@LaCasaBlaugrana💙❤️`
                );
            }

            ultimoEstado = estado;
            ultimoMarcador = marcadorActual;

        } catch (error) {

            console.error(error);
        }

    }, 60000);

};