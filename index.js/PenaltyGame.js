const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

// =======================
// PARTIDAS ACTIVAS
// =======================

const partidas = new Map();

// =======================
// CREAR PARTIDA
// =======================

function crearPartida(canalID, jugador1, jugador2) {

    partidas.set(canalID, {

        jugador1,
        jugador2,

        turno: 1,

        goles1: 0,
        goles2: 0,

        penales1: [],
        penales2: [],

        tira: jugador1,
        ataja: jugador2,

        estado: "esperando_disparo"

    });

    return partidas.get(canalID);

}

// =======================
// OBTENER PARTIDA
// =======================

function obtenerPartida(canalID) {

    return partidas.get(canalID);

}

// =======================
// MOSTRAR TABLERO
// =======================

function mostrarTablero(partida) {

    return new EmbedBuilder()

        .setColor("Gold")

        .setTitle("🏆 TANDA DE PENALES")

        .setDescription(`

━━━━━━━━━━━━━━━━━━

🔴 <@${partida.jugador1}>

${partida.penales1.join(" ")} ${"⚪ ".repeat(5 - partida.penales1.length)}

🆚

🔵 <@${partida.jugador2}>

${partida.penales2.join(" ")} ${"⚪ ".repeat(5 - partida.penales2.length)}

━━━━━━━━━━━━━━━━━━

**Turno ${partida.turno} de 5**

⚽ **Patea:** <@${partida.tira}>

🧤 **Ataja:** <@${partida.ataja}>

`);

}

// =======================
// BOTÓN DISPARAR
// =======================

function botonDisparo() {

    return new ActionRowBuilder()

        .addComponents(

            new ButtonBuilder()

                .setCustomId("elegir_disparo")

                .setLabel("🎯 Elegir disparo")

                .setStyle(ButtonStyle.Primary)

        );

}

// =======================
// BOTÓN ATAJAR
// =======================

function botonAtajada() {

    return new ActionRowBuilder()

        .addComponents(

            new ButtonBuilder()

                .setCustomId("elegir_atajada")

                .setLabel("🧤 Elegir atajada")

                .setStyle(ButtonStyle.Success)

        );

}

// =======================
// ZONAS DEL ARCO
// =======================

function botonesDisparo() {

    return [

        new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId("disparo_AI")
                .setLabel("↖️")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("disparo_AC")
                .setLabel("⬆️")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("disparo_AD")
                .setLabel("↗️")
                .setStyle(ButtonStyle.Secondary)

        ),

        new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId("disparo_CI")
                .setLabel("⬅️")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("disparo_CC")
                .setLabel("⏺️")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("disparo_CD")
                .setLabel("➡️")
                .setStyle(ButtonStyle.Secondary)

        ),

        new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId("disparo_BI")
                .setLabel("↙️")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("disparo_BC")
                .setLabel("⬇️")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("disparo_BD")
                .setLabel("↘️")
                .setStyle(ButtonStyle.Secondary)

        )

    ];

}

// =======================
// ZONAS PARA ATAJAR
// =======================

function botonesAtajada() {

    return [

        new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId("atajada_AI")
                .setLabel("↖️")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("atajada_AC")
                .setLabel("⬆️")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("atajada_AD")
                .setLabel("↗️")
                .setStyle(ButtonStyle.Primary)

        ),

        new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId("atajada_CI")
                .setLabel("⬅️")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("atajada_CC")
                .setLabel("⏺️")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("atajada_CD")
                .setLabel("➡️")
                .setStyle(ButtonStyle.Primary)

        ),

        new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId("atajada_BI")
                .setLabel("↙️")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("atajada_BC")
                .setLabel("⬇️")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("atajada_BD")
                .setLabel("↘️")
                .setStyle(ButtonStyle.Primary)

        )

    ];

}

// =======================
// GUARDAR DISPARO
// =======================

function guardarDisparo(canalID, zona) {

    const partida = partidas.get(canalID);

    if (!partida) return;

    partida.disparo = zona;

}

// =======================
// OBTENER DISPARO
// =======================

function obtenerDisparo(canalID) {

    return partidas.get(canalID)?.disparo;

}

// =======================
// CAMBIAR TURNO AL ARQUERO
// =======================

function pasarAlArquero(canalID) {

    const partida = partidas.get(canalID);

    if (!partida) return;

    partida.estado = "esperando_atajada";

}


// =======================
// GUARDAR ATAJADA
// =======================

function guardarAtajada(canalID, zona) {

    const partida = partidas.get(canalID);

    if (!partida) return;

    partida.atajada = zona;

}

// =======================
// OBTENER ATAJADA
// =======================

function obtenerAtajada(canalID) {

    return partidas.get(canalID)?.atajada;

}

// =======================
// COMPARAR PENAL
// =======================

function resultadoPenal(canalID) {

    const partida = partidas.get(canalID);

    if (!partida) return null;

    if (partida.disparo === partida.atajada) {
        return "ATAJADA";
    }

    return "GOL";

}

// =======================
// LIMPIAR JUGADA
// =======================

function limpiarJugada(canalID) {

    const partida = partidas.get(canalID);

    if (!partida) return;

    delete partida.disparo;
    delete partida.atajada;

}

// =======================
// FINALIZAR TURNO
// =======================

function finalizarTurno(canalID, resultado) {

    const partida = partidas.get(canalID);

    if (!partida) return;

    if (partida.tira === partida.jugador1) {

        if (resultado === "GOL") {

            partida.goles1++;
            partida.penales1.push("🟢");

        } else {

            partida.penales1.push("🔴");

        }

        partida.tira = partida.jugador2;
        partida.ataja = partida.jugador1;

    } else {

        if (resultado === "GOL") {

            partida.goles2++;
            partida.penales2.push("🟢");

        } else {

            partida.penales2.push("🔴");

        }

        partida.tira = partida.jugador1;
        partida.ataja = partida.jugador2;

        partida.turno++;

    }

    partida.estado = "esperando_disparo";

}

// =======================
// ¿TERMINÓ LA TANDA?
// =======================

function terminoPartida(canalID) {

    const partida = partidas.get(canalID);

    if (!partida) return false;

    if (
        partida.penales1.length >= 5 &&
        partida.penales2.length >= 5
    ) {
        return true;
    }

    return false;

}

// =======================
// OBTENER GANADOR
// =======================

function obtenerGanador(canalID) {

    const partida = partidas.get(canalID);

    if (!partida) return null;

    if (partida.goles1 > partida.goles2)
        return partida.jugador1;

    if (partida.goles2 > partida.goles1)
        return partida.jugador2;

    return "EMPATE";

}

module.exports = {

    crearPartida,
    obtenerPartida,
    mostrarTablero,

    botonDisparo,
    botonAtajada,

    botonesDisparo,
    botonesAtajada,

    guardarDisparo,
    obtenerDisparo,

    guardarAtajada,
    obtenerAtajada,

    pasarAlArquero,

    resultadoPenal,
    limpiarJugada,

    finalizarTurno,

    terminoPartida,
    obtenerGanador

};