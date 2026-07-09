const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const PenaltyGame = require("./PenaltyGame");


module.exports = (client) => {

    client.on("messageCreate", async (message) => {

        if (message.author.bot) return;

        if (!message.content.startsWith("!penales")) return;

        const rival = message.mentions.users.first();

        if (!rival) {

            return message.reply("❌ Debes mencionar a un usuario.\n\nEjemplo:\n`!penales @usuario`");

        }

        if (rival.bot) {

            return message.reply("❌ No puedes retar a un bot.");

        }

        if (rival.id === message.author.id) {

            return message.reply("😂 No puedes jugar contra ti mismo.");

        }

const fila = new ActionRowBuilder().addComponents(

    new ButtonBuilder()
        .setCustomId(`aceptar_${rival.id}_${message.author.id}`)
        .setLabel("Aceptar")
        .setEmoji("✅")
        .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
        .setCustomId(`rechazar_${rival.id}_${message.author.id}`)
        .setLabel("Rechazar")
        .setEmoji("❌")
        .setStyle(ButtonStyle.Danger)

);

        const embed = new EmbedBuilder()

            .setColor("Blue")

            .setTitle("⚽ ¡Reto de Penales!")

            .setDescription(
                `${message.author} ha retado a ${rival} a una tanda de penales.\n\n¿Aceptas el desafío?`
            )

            .setFooter({
                text: "Próximamente aparecerán los botones."
            });

        const mensajeReto = await message.channel.send({

    content: `${rival}`,

    embeds: [embed],

    components: [fila]

});

    });

    client.on("interactionCreate", async (interaction) => {

    if (!interaction.isButton()) return;

    // ==========================
    // BOTÓN ACEPTAR
    // ==========================

    if (interaction.customId.startsWith("aceptar_")) {

        const datos = interaction.customId.split("_");

const rivalID = datos[1];
const retadorID = datos[2];

        if (interaction.user.id !== rivalID) {

            return interaction.reply({
                content: "❌ Este desafío no es para ti.",
                ephemeral: true
            });

        }

        // =======================
// CREAR PARTIDA
// =======================

PenaltyGame.crearPartida(

    interaction.channel.id,

    retadorID,

    rivalID

);

const partida = PenaltyGame.obtenerPartida(interaction.channel.id);

const embed = PenaltyGame.mostrarTablero(partida);


        await interaction.update({

    embeds: [embed],

    components: [

        PenaltyGame.botonDisparo()

    ]

});

    }

// ==========================
// BOTÓN ELEGIR DISPARO
// ==========================

if (interaction.customId === "elegir_disparo") {

    const partida = PenaltyGame.obtenerPartida(interaction.channel.id);

    if (!partida) {
        return interaction.reply({
            content: "❌ No hay ninguna partida activa.",
            ephemeral: true
        });
    }

    if (interaction.user.id !== partida.tira) {
        return interaction.reply({
            content: "❌ Aún no es tu turno para disparar.",
            ephemeral: true
        });
    }

    return interaction.reply({
        content: "🎯 Elige la zona donde quieres disparar:",
        components: PenaltyGame.botonesDisparo(),
        ephemeral: true
    });

}

// ==========================
// BOTÓN ELEGIR ATAJADA
// ==========================

if (interaction.customId === "elegir_atajada") {

    const partida = PenaltyGame.obtenerPartida(interaction.channel.id);

    if (!partida) {

        return interaction.reply({
            content: "❌ No hay ninguna partida activa.",
            ephemeral: true
        });

    }

    if (interaction.user.id !== partida.ataja) {

        return interaction.reply({
            content: "❌ Aún no es tu turno para atajar.",
            ephemeral: true
        });

    }

    return interaction.reply({

        content: "🧤 Elige hacia dónde lanzarte:",

        components: PenaltyGame.botonesAtajada(),

        ephemeral: true

    });

}

// ==========================
// ELEGIR ZONA DE DISPARO
// ==========================

if (interaction.customId.startsWith("disparo_")) {

    const partida = PenaltyGame.obtenerPartida(interaction.channel.id);

    if (!partida) {
        return interaction.reply({
            content: "❌ No hay ninguna partida activa.",
            ephemeral: true
        });
    }

    if (interaction.user.id !== partida.tira) {
        return interaction.reply({
            content: "❌ No puedes elegir el disparo de otro jugador.",
            ephemeral: true
        });
    }

    const zona = interaction.customId.replace("disparo_", "");

    PenaltyGame.guardarDisparo(
        interaction.channel.id,
        zona
    );

    PenaltyGame.pasarAlArquero(interaction.channel.id);

const embed = PenaltyGame.mostrarTablero(partida);

return interaction.update({

    content: "",

    embeds: [embed],

    components: [

        PenaltyGame.botonAtajada()

    ]

});

}

// ==========================
// ELEGIR ZONA DE ATAJADA
// ==========================

if (interaction.customId.startsWith("atajada_")) {

    const partida = PenaltyGame.obtenerPartida(interaction.channel.id);

    if (!partida) {

        return interaction.reply({
            content: "❌ No hay ninguna partida activa.",
            ephemeral: true
        });

    }

    if (interaction.user.id !== partida.ataja) {

        return interaction.reply({
            content: "❌ No es tu turno para atajar.",
            ephemeral: true
        });

    }

    const zona = interaction.customId.replace("atajada_", "");

    PenaltyGame.guardarAtajada(
        interaction.channel.id,
        zona
    );

    const resultado = PenaltyGame.resultadoPenal(
        interaction.channel.id
    );

    PenaltyGame.finalizarTurno(

    interaction.channel.id,

    resultado

);

PenaltyGame.limpiarJugada(

    interaction.channel.id

);

if (PenaltyGame.terminoPartida(interaction.channel.id)) {

    const ganador = PenaltyGame.obtenerGanador(interaction.channel.id);

    if (ganador === "EMPATE") {

        return interaction.update({

            content: "🤝 ¡EMPATE!\n\n🔥 Se viene la muerte súbita.",

            embeds: [],

            components: []

        });

    }

    return interaction.update({

        content: `🏆 ¡<@${ganador}> ganó la tanda de penales!`,

        embeds: [],

        components: []

    });

}

const nuevaPartida = PenaltyGame.obtenerPartida(interaction.channel.id);

const embed = PenaltyGame.mostrarTablero(nuevaPartida);

return interaction.update({

    content:
        resultado === "GOL"
            ? "⚽ **¡¡GOOOOOOL!!**"
            : "🧤 **¡¡ATAJADÓN!!**",

    embeds: [embed],

    components: [

        PenaltyGame.botonDisparo()

    ]

});

}

    // ==========================
    // BOTÓN RECHAZAR
    // ==========================

    if (interaction.customId.startsWith("rechazar_")) {

        const datos = interaction.customId.split("_");

const rivalID = datos[1];
const retadorID = datos[2];

        if (interaction.user.id !== rivalID) {

            return interaction.reply({
                content: "❌ Este desafío no es para ti.",
                ephemeral: true
            });

        }

        const embed = EmbedBuilder.from(interaction.message.embeds[0])

            .setColor("Red")

            .setTitle("❌ Desafío rechazado")

            .setDescription(
                `${interaction.user} rechazó la tanda de penales.`
            );

        await interaction.update({

            embeds: [embed],

            components: []

        });

    }

});

};