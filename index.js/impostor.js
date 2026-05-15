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

            return message.channel.send(
`⚽ PARTIDA CREADA

👑 Host: ${message.author.username}`
            );
        }

        // =======================
        // COMANDOS
        // =======================

        if (contenido === "!comandos") {

            return message.channel.send(
`📌 COMANDOS

!crear
!unirse
!iniciar
!salir
!cancelar
!pista (tu pista)
!votacion
!votar @usuario`
            );
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

            return message.channel.send(
`✅ ${message.author.username} se unió.

👥 Jugadores: ${partida.jugadores.length}`
            );
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

            message.channel.send(
`🚪 ${message.author.username} salió de la partida.`
            );

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

            return message.channel.send(
                "🛑 La partida fue cancelada."
            );
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

            return message.channel.send(
`🔥 LA PARTIDA COMENZÓ

🕵️ Impostores: ${cantidadImpostores}

🎤 PRIMER TURNO:

👉 ${primerJugador}

📌 Usa:

!pista (tu pista)`
            );
        }

        // =======================
        // SISTEMA DE TURNOS
        // =======================

        const partidaTurno =
            partidas.get(message.guild.id);

        if (
            partidaTurno &&
            partidaTurno.iniciada &&
            !partidaTurno.votacionIniciada
        ) {

            // BORRAR MENSAJES NORMALES

            if (
                !contenido.startsWith("!")
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

                const jugadorActualID =
                    partidaTurno.ordenTurnos[
                        partidaTurno.turnoActual
                    ];

                // NO ES SU TURNO

                if (
                    message.author.id !==
                    jugadorActualID
                ) {

                    await message.delete().catch(() => {});
                    return;
                }

                // OBTENER PISTA

                const pista =
                    message.content
                    .slice(7)
                    .trim();

                if (!pista) {

                    return message.reply(
                        "⚠️ Escribe una pista."
                    );
                }

                // GUARDAR

                partidaTurno.pistas[
                    message.author.id
                ] = pista;

                // BORRAR COMANDO

                await message.delete().catch(() => {});

                // MOSTRAR PISTA

                await message.channel.send(
`👤 ${message.author.username}:

"${pista}"`
                );

                partidaTurno.turnoActual++;

                // TODOS HABLARON

                if (
                    partidaTurno.turnoActual >=
                    partidaTurno.ordenTurnos.length
                ) {

                    partidaTurno.faseVotacion = true;

                    let resumen =
`📋 RESUMEN DE PISTAS:

`;

                    for (
                        const jugadorID
                        of partidaTurno.ordenTurnos
                    ) {

                        const usuario =
                            await client.users.fetch(
                                jugadorID
                            );

                        resumen +=
`👤 ${usuario.username}:
"${partidaTurno.pistas[jugadorID]}"

`;
                    }

                    return message.channel.send(
`${resumen}

🗣️ PUEDEN HABLAR LIBREMENTE

📌 Cuando quieran empezar la votación:

!votacion`
                    );
                }

                // SIGUIENTE

                const siguienteJugador =
                    await client.users.fetch(
                        partidaTurno.ordenTurnos[
                            partidaTurno.turnoActual
                        ]
                    );

                return message.channel.send(
`🎤 TURNO DE:

👉 ${siguienteJugador}

📌 Usa:

!pista (tu pista)`
                );
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

            return message.channel.send(
`🗳️ ¡LA VOTACIÓN HA COMENZADO!

📌 Usa:

!votar @usuario`
            );
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

            if (!partida.iniciada) {
                return message.reply(
                    "⚠️ La partida todavía no empezó."
                );
            }

            if (!partida.faseVotacion) {
                return message.reply(
                    "⚠️ Todavía no pueden votar."
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

            if (mencionado.bot) {
                return message.reply(
                    "🤨 No puedes votar bots."
                );
            }

            if (
                !partida.jugadores.includes(
                    mencionado.id
                )
            ) {
                return message.reply(
                    "⚠️ No está jugando."
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

            message.channel.send(
`🗳️ ${message.author.username} votó por ${mencionado.username}`
            );

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

                if (
                    partida.impostores.includes(
                        masVotado
                    )
                ) {

                    message.channel.send(
`━━━━━━━━━━━━━━
🕵️ LOS IMPOSTORES ERAN...
${impostoresTexto.join(", ")}
━━━━━━━━━━━━━━

⚽ La palabra era:
${partida.palabra}

🎉 ¡Ganaron los jugadores!`
                    );

                } else {

                    message.channel.send(
`━━━━━━━━━━━━━━
🕵️ LOS IMPOSTORES ERAN...
${impostoresTexto.join(", ")}
━━━━━━━━━━━━━━

⚽ La palabra era:
${partida.palabra}

👑 ¡Ganaron los impostores!`
                    );
                }

                partidas.delete(
                    message.guild.id
                );
            }

            return;
        }

    });

};