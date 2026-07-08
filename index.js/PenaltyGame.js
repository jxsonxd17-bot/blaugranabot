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

        tiros1: 0,
        tiros2: 0,

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

⚪⚪⚪⚪⚪

🆚

🔵 <@${partida.jugador2}>

⚪⚪⚪⚪⚪

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

module.exports = {

    crearPartida,
    obtenerPartida,
    mostrarTablero,
    botonesDisparo
    
};