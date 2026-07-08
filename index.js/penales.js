const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const PenaltyGame = require("./PenaltyGame");

// =======================
// PARTIDAS ACTIVAS
// =======================

const partidas = new Map();

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

${"⚪ ".repeat(partida.tiros1)}

🆚

🔵 <@${partida.jugador2}>

${"⚪ ".repeat(partida.tiros2)}

━━━━━━━━━━━━━━━━━━

**Turno ${partida.turno} de 5**

⚽ **Patea:** <@${partida.tira}>

🧤 **Ataja:** <@${partida.ataja}>

`);

}

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