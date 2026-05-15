const {
    EmbedBuilder
} = require("discord.js");

const palabras = require("./data/futbolistas");

// =======================
// CANAL DEL JUEGO
// =======================

const canalJuegoID = '1504907864257466438';

// =======================
// BASE DE PARTIDAS
// =======================

const partidas = new Map();

module.exports = (client) => {

    client.on("messageCreate", async (message) => {

        if (message.author.bot) return;
        if (!message.guild) return;

        // SOLO FUNCIONA EN EL CANAL DEL JUEGO
        if (message.channel.id !== canalJuegoID) return;

        const contenido = message.content.toLowerCase();

        // =======================
        // CREAR
        // =======================

        if (contenido === "!crear") {

            if (partidas.has(message.guild.id)) {
                return message.reply(
                    "⚠️ Ya existe una partida."
                );
            }

            partidas.set(message.guild.id, {
                host: message.author.id,
                jugadores: [message.author.id],
                iniciada: false,
                votos: {},
                turnoActual: 0,
                ordenTurnos: [],
                pistas: {},
                faseVotacion: false,
                votacionIniciada: false,
                impostores: []
            });

            const embed = new EmbedBuilder()
                .setColor("#004D98")
                .setTitle("⚽ PARTIDA CREADA")
                .setDescription(
                    `👑 Host: ${message.author}`
                )
                .setFooter({
                    text: "Impostor Futbolero"
                });

            return message.channel.send({
                embeds: [embed]
            });
        }

        // =======================
        // COMANDOS
        // =======================

        if (contenido === "!comandos") {

            const embed = new EmbedBuilder()
                .setColor("#004D98")
                .setTitle("📌 COMANDOS")
                .setDescription(
`⚽ !crear
⚽ !unirse
⚽ !iniciar
⚽ !salir
⚽ !cancelar
⚽ !pista (tu pista)
⚽ !votacion
⚽ !votar @usuario`
                );

            return message.channel.send({
                embeds: [embed]
            });
        }

        // =======================
        // UNIRSE
        // =======================

        if (contenido === "!unirse") {

            const partida =
                partidas.get(message.guild.id);

            if (!partida) {
                return message.reply(
                    "❌ No hay partida."
                );
            }

            if (partida.iniciada) {
                return message.reply(
                    "⚠️ La partida ya comenzó."
                );
            }

            if (
                partida.jugadores.includes(
                    message.author.id
                )
            ) {
                return message.reply(
                    "⚠️ Ya estás dentro."
                );
            }

            partida.jugadores.push(
                message.author.id
            );

            const embed = new EmbedBuilder()
                .setColor("#00A86B")
                .setTitle("✅ JUGADOR UNIDO")
                .setDescription(
`👤 ${message.author}

👥 Jugadores:
${partida.jugadores.length}`
                );

            return message.channel.send({
                embeds: [embed]
            });
        }

        // =======================
        // SALIR
        // =======================

        if (contenido === "!salir") {

            const partida =
                partidas.get(message.guild.id);

            if (!partida) {
                return message.reply(
                    "❌ No hay partida."
                );
            }

            partida.jugadores =
                partida.jugadores.filter(
                    id => id !== message.author.id
                );

            const embed =
                new EmbedBuilder()
                .setColor("#D72638")
                .setTitle("🚪 JUGADOR SALIÓ")
                .setDescription(
                    `${message.author} salió de la partida.`
                );

            message.channel.send({
                embeds: [embed]
            });

            if (partida.jugadores.length === 0) {

                partidas.delete(message.guild.id);

                return message.channel.send(
                    "💀 La partida fue eliminada."
                );
            }

            return;
        }

        // =======================
        // CANCELAR
        // =======================

        if (contenido === "!cancelar") {

            const partida =
                partidas.get(message.guild.id);

            if (!partida) {
                return message.reply(
                    "❌ No hay partida."
                );
            }

            if (
                message.author.id !==
                partida.host
            ) {
                return message.reply(
                    "❌ Solo el host puede cancelar."
                );
            }

            partidas.delete(message.guild.id);

            const embed =
                new EmbedBuilder()
                .setColor("#D72638")
                .setTitle("🛑 PARTIDA CANCELADA")
                .setDescription(
                    `👑 ${message.author} canceló la partida.`
                );

            return message.channel.send({
                embeds: [embed]
            });
        }

        // =======================
        // INICIAR
        // =======================

        if (contenido === "!iniciar") {

            const partida =
                partidas.get(message.guild.id);

            if (!partida) {
                return message.reply(
                    "❌ No hay partida."
                );
            }

            if (
                message.author.id !== partida.host
            ) {
                return message.reply(
                    "❌ Solo el host puede iniciar."
                );
            }

            if (
                partida.jugadores.length < 3
            ) {
                return message.reply(
                    "⚠️ Necesitan mínimo 3 jugadores."
                );
            }

            const palabra =
                palabras[
                    Math.floor(
                        Math.random() *
                        palabras.length
                    )
                ];

            // =======================
            // CANTIDAD IMPOSTORES
            // =======================

            let cantidadImpostores = 1;

            if (partida.jugadores.length >= 9) {

                cantidadImpostores = 4;

            } else if (partida.jugadores.length >= 7) {

                cantidadImpostores = 3;

            } else if (partida.jugadores.length >= 5) {

                cantidadImpostores = 2;
            }

            // =======================
            // ELEGIR IMPOSTORES
            // =======================

            const impostores = [];

            const jugadoresDisponibles =
                [...partida.jugadores];

            for (
                let i = 0;
                i < cantidadImpostores;
                i++
            ) {

                const randomIndex =
                    Math.floor(
                        Math.random() *
                        jugadoresDisponibles.length
                    );

                impostores.push(
                    jugadoresDisponibles[randomIndex]
                );

                jugadoresDisponibles.splice(
                    randomIndex,
                    1
                );
            }

            partida.iniciada = true;
            partida.palabra = palabra;
            partida.impostores = impostores;

            partida.ordenTurnos =
                [...partida.jugadores]
                .sort(() =>
                    Math.random() - 0.5
                );

            partida.turnoActual = 0;

            // =======================
            // DMS
            // =======================

            for (const jugadorID of partida.jugadores) {

                const jugador =
                    await client.users.fetch(
                        jugadorID
                    );

                try {

                    if (
                        partida.impostores.includes(
                            jugadorID
                        )
                    ) {

                        await jugador.send(
`🕵️ ERES IMPOSTOR

Descubre la palabra sin que te descubran.`
                        );

                    } else {

                        await jugador.send(
`⚽ TU PALABRA ES:

${palabra}`
                        );
                    }

                } catch {

                    message.channel.send(
`❌ ${jugador.username} tiene los MD cerrados.`
                    );
                }
            }

            const primerJugador =
                await client.users.fetch(
                    partida.ordenTurnos[0]
                );

            const textoImpostor =
                cantidadImpostores === 1
                    ? "🕵️ Hay 1 impostor"
                    : `🕵️ Hay ${cantidadImpostores} impostores`;

            const embed = new EmbedBuilder()
                .setColor("#004D98")
                .setTitle("🔥 LA PARTIDA COMENZÓ")
                .setDescription(
`${textoImpostor}

🎤 Primer turno:
👉 ${primerJugador}

📌 Usa:
!pista (tu pista)`
                )
                .setFooter({
                    text: "Impostor Futbolero"
                });

            return message.channel.send({
                embeds: [embed]
            });
        }

        // =======================
        // TURNOS
        // =======================

        const partidaTurno =
            partidas.get(message.guild.id);

        if (
            partidaTurno &&
            partidaTurno.iniciada
        ) {

            // BORRAR MENSAJES NORMALES
            // SOLO DURANTE PISTAS

            if (
                !contenido.startsWith("!") &&
                !partidaTurno.faseVotacion
            ) {

                await message.delete().catch(() => {});
                return;
            }

            // =======================
            // PISTA
            // =======================

            if (
                contenido.startsWith("!pista")
            ) {

                if (
                    partidaTurno.votacionIniciada
                ) {
                    return;
                }

                const jugadorActualID =
                    partidaTurno.ordenTurnos[
                        partidaTurno.turnoActual
                    ];

                if (
                    message.author.id !==
                    jugadorActualID
                ) {

                    await message.delete().catch(() => {});
                    return;
                }

                const pista =
                    message.content
                    .slice(7)
                    .trim();

                if (!pista) {

                    return message.reply(
                        "⚠️ Escribe una pista."
                    );
                }

                partidaTurno.pistas[
                    message.author.id
                ] = pista;

                await message.delete().catch(() => {});

                // EMBED PISTA

                const embedPista =
                    new EmbedBuilder()
                    .setColor("#1E1E1E")
                    .setAuthor({
                        name: message.author.username,
                        iconURL:
                        message.author.displayAvatarURL()
                    })
                    .setDescription(
`💬 "${pista}"`
                    );

                await message.channel.send({
                    embeds: [embedPista]
                });

                partidaTurno.turnoActual++;

                // TODOS HABLARON

                if (
                    partidaTurno.turnoActual >=
                    partidaTurno.ordenTurnos.length
                ) {

                    partidaTurno.faseVotacion = true;

                    const embed =
                        new EmbedBuilder()
                        .setColor("#F4C542")
                        .setTitle(
                            "🗣️ FASE DE DISCUSIÓN"
                        )
                        .setDescription(
`Ahora pueden hablar libremente.

📌 Cuando quieran votar:

!votacion`
                        );

                    return message.channel.send({
                        embeds: [embed]
                    });
                }

                // SIGUIENTE TURNO

                const siguienteJugador =
                    await client.users.fetch(
                        partidaTurno.ordenTurnos[
                            partidaTurno.turnoActual
                        ]
                    );

                const embedTurno =
                    new EmbedBuilder()
                    .setColor("#004D98")
                    .setTitle("🎤 NUEVO TURNO")
                    .setDescription(
`👉 ${siguienteJugador}

📌 Usa:
!pista (tu pista)`
                    );

                return message.channel.send({
                    embeds: [embedTurno]
                });
            }
        }

        // =======================
        // INICIAR VOTACIÓN
        // =======================

        if (contenido === "!votacion") {

            const partida =
                partidas.get(message.guild.id);

            if (!partida) {
                return message.reply(
                    "❌ No hay partida."
                );
            }

            if (!partida.faseVotacion) {
                return message.reply(
                    "⚠️ Todavía no terminó la ronda de pistas."
                );
            }

            if (partida.votacionIniciada) {
                return message.reply(
                    "⚠️ La votación ya comenzó."
                );
            }

            partida.votacionIniciada = true;

            const embed =
                new EmbedBuilder()
                .setColor("#D72638")
                .setTitle("🗳️ VOTACIÓN")
                .setDescription(
`📌 Usa:

!votar @usuario`
                );

            return message.channel.send({
                embeds: [embed]
            });
        }

        // =======================
        // VOTAR
        // =======================

        if (contenido.startsWith("!votar")) {

            const partida =
                partidas.get(message.guild.id);

            if (!partida) {
                return message.reply(
                    "❌ No hay partida activa."
                );
            }

            if (!partida.votacionIniciada) {
                return message.reply(
                    "⚠️ Primero usen !votacion"
                );
            }

            const mencionado =
                message.mentions.users.first();

            if (!mencionado) {
                return message.reply(
                    "⚠️ Menciona a alguien."
                );
            }

            if (
                partida.votos[
                    message.author.id
                ]
            ) {
                return message.reply(
                    "⚠️ Ya votaste."
                );
            }

            partida.votos[
                message.author.id
            ] = mencionado.id;

            const embedVoto =
                new EmbedBuilder()
                .setColor("#D72638")
                .setDescription(
`🗳️ ${message.author} votó por ${mencionado}`
                );

            await message.channel.send({
                embeds: [embedVoto]
            });

            // TODOS VOTARON

            if (
                Object.keys(partida.votos)
                .length >=
                partida.jugadores.length
            ) {

                const conteo = {};

                Object.values(
                    partida.votos
                ).forEach(voto => {

                    conteo[voto] =
                        (conteo[voto] || 0) + 1;
                });

                let masVotado = null;
                let maxVotos = 0;

                for (const id in conteo) {

                    if (
                        conteo[id] > maxVotos
                    ) {

                        maxVotos =
                            conteo[id];

                        masVotado = id;
                    }
                }

                const impostoresTexto =
                    await Promise.all(
                        partida.impostores.map(
                            async (id) => {
                                const user =
                                    await client.users.fetch(id);
                                return user.username;
                            }
                        )
                    );

                const textoImpostores =
                    partida.impostores.length === 1
                        ? "🕵️ EL IMPOSTOR ERA..."
                        : "🕵️ LOS IMPOSTORES ERAN...";

                const ganaronJugadores =
                    partida.impostores.includes(
                        masVotado
                    );

                const embedFinal =
                    new EmbedBuilder()
                    .setColor(
                        ganaronJugadores
                            ? "#00A86B"
                            : "#D72638"
                    )
                    .setTitle(
                        ganaronJugadores
                            ? "🎉 GANARON LOS JUGADORES"
                            : "👑 GANARON LOS IMPOSTORES"
                    )
                    .setDescription(
`${textoImpostores}

⚽ ${impostoresTexto.join(", ")}

📌 La palabra era:
"${partida.palabra}"`
                    );

                await message.channel.send({
                    embeds: [embedFinal]
                });

                partidas.delete(
                    message.guild.id
                );
            }

            return;
        }

    });

};