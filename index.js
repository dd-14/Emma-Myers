const { 
    Client, 
    GatewayIntentBits, 
    REST, 
    Routes, 
    SlashCommandBuilder 
} = require('discord.js');

// Token integrado
const TOKEN = "MTU2MTkyNzQyMTE5ODg2MDM5OA.GHB1tY.lcZFAmNfzWKl4nMinSzPXsYMVANJ0KFfwHn2I0";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

// Base de datos simple en memoria para el Modo Carrera
const carreras = new Map();

// Definición de Comandos
const commands = [
    // --- BÁSICOS ---
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Probá el ping del bot.'),

    new SlashCommandBuilder()
        .setName('hora')
        .setDescription('Muestra la hora actual en Los Ángeles, California.'),

    new SlashCommandBuilder()
        .setName('moneda')
        .setDescription('Tirás una moneda para ver quién arranca el partido.'),

    new SlashCommandBuilder()
        .setName('dado')
        .setDescription('Tirás un dado de 6 caras para definir cualquier gilada.'),

    new SlashCommandBuilder()
        .setName('frase')
        .setDescription('Tirá una frase tribunera al azar.'),

    // --- OPINIÓN Y TERMEO ---
    new SlashCommandBuilder()
        .setName('opinar')
        .setDescription('Tirá un tema y te digo la posta.')
        .addStringOption(opt =>
            opt.setName('tema')
                .setDescription('Jugador, club o partido')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('facto-o-fantasma')
        .setDescription('Decile a la tribuna si una opinión es facto o humo.')
        .addStringOption(opt =>
            opt.setName('opinion')
                .setDescription('Tu afirmación futbolera')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('termo-test')
        .setDescription('Medí qué tan termo sos.')
        .addUserOption(opt =>
            opt.setName('usuario')
                .setDescription('A quién querés medir (opcional)')
                .setRequired(false)),

    // --- MODO CARRERA ---
    new SlashCommandBuilder()
        .setName('carrera-crear')
        .setDescription('Creás tu club para arrancar tu Modo Carrera.')
        .addStringOption(opt =>
            opt.setName('nombre')
                .setDescription('Nombre de tu club de fútbol')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('carrera-perfil')
        .setDescription('Mirá el estado de tu club, nivel y puntos.'),

    new SlashCommandBuilder()
        .setName('carrera-entrenar')
        .setDescription('Entrenás a tu equipo para subir de nivel y jugar mejor.'),

    new SlashCommandBuilder()
        .setName('carrera-partido')
        .setDescription('Jugás un partido picante contra un rival al azar.')
];

// Evento Ready
client.once('ready', async () => {
    console.log(`Prendido como ${client.user.tag} ⚽`);

    const rest = new REST({ version: '10' }).setToken(TOKEN);

    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );
        console.log('Comandos cargados impecable.');
    } catch (error) {
        console.error('Error al subir comandos:', error);
    }
});

// Manejo de Comandos
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName, user } = interaction;

    // 1. /ping
    if (commandName === 'ping') {
        const ping = client.ws.ping;
        await interaction.reply(`mamita querida ${ping}ms de latencia, va re volando esto che ⚽`);
    }

    // 2. /hora (Los Ángeles, California)
    else if (commandName === 'hora') {
        const horaLA = new Date().toLocaleTimeString('es-AR', { 
            timeZone: 'America/Los_Angeles',
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
        await interaction.reply(`escuchame una cosa, en los ángeles (california) son las **${horaLA}** hs ⏰🇺🇸`);
    }

    // 3. /moneda
    else if (commandName === 'moneda') {
        const resultado = Math.random() < 0.5 ? 'cara' : 'cruz';
        await interaction.reply(`tiré la moneda al aire y salió **${resultado.toUpperCase()}**. el que eligió ${resultado} saca del medio 🪙⚽`);
    }

    // 4. /dado
    else if (commandName === 'dado') {
        const numero = Math.floor(Math.random() * 6) + 1;
        await interaction.reply(`salió un **${numero}** 🎲`);
    }

    // 5. /frase
    else if (commandName === 'frase') {
        const frases = [
            "escuchame una cosa, ¡la pelota no se mancha jamás! ⚽",
            "mamita querida qué manera de sufrir un partido por favor 🍿",
            "pará pará... ¿vieron la jugada que acaba de hacer? me vuelvo loco 🔥",
            "acá se habla de fútbol con el corazón en la mano y la termo en la mesa 🇦🇷",
            "es un montón... no tiene ningún tipo de sentido lo que estamos viendo hoy"
        ];
        await interaction.reply(frases[Math.floor(Math.random() * frases.length)]);
    }

    // 6. /opinar
    else if (commandName === 'opinar') {
        const tema = interaction.options.getString('tema');
        const respuestas = [
            `escuchame una cosa sobre **${tema}**... es un montón hermano me vuelvo completamente loco ⚽🔥`,
            `mirá te soy sincera, **${tema}** a mí no me vende humo. lo inflan un paquete pero le falta potrero 💀`,
            `¡mamita querida! lo de **${tema}** es histórico mal, el que no lo banca no entiende nada de fútbol posta`,
            `pará pará pará... ¿en serio me preguntás por **${tema}**? tema jodidísimo pero te firmo acá que va a dar que hablar 🍿`,
            `banco totalmente lo de **${tema}**, sexo puro en la cancha una locura total`
        ];
        await interaction.reply(respuestas[Math.floor(Math.random() * respuestas.length)]);
    }

    // 7. /facto-o-fantasma
    else if (commandName === 'facto-o-fantasma') {
        const opinion = interaction.options.getString('opinion');
        const esFacto = Math.random() < 0.5;

        if (esFacto) {
            await interaction.reply(`"_${opinion}_"\n\n**FACTO ABSOLUTO.** banco totalmente amigo, lo dijiste con una mano en el corazón y la verdad sobre la mesa ⚽🔥`);
        } else {
            await interaction.reply(`"_${opinion}_"\n\n**FANTASMADA TOTAL.** mamita querida borrá eso boludo... te pasaste de termo, terrible humo acabás de tirar 🤡💀`);
        }
    }

    // 8. /termo-test
    else if (commandName === 'termo-test') {
        const targetUser = interaction.options.getUser('usuario') || user;
        const porcentaje = Math.floor(Math.random() * 101);

        let remate = '';
        if (porcentaje < 25) remate = 'sos un espectador de teatro hermano, te falta una banda de calentura futbolera 🎭';
        else if (porcentaje < 60) remate = 'sos un hincha bastante razonable, bancás a tu club pero sabés cuándo jugaron mal 👍';
        else if (porcentaje < 85) remate = 're contra termo. gritás los goles en la cara y te peleás en twitter todos los domingos 🔥';
        else remate = '¡MAMITA QUERIDA! nivel de termo nuclear. no escuchás razones no ves nada con imparcialidad sos la hinchada misma boludo 🏆💀';

        await interaction.reply(`el nivel de termo de **${targetUser.username}** es del **${porcentaje}%**.\n${remate}`);
    }

    // --- MODO CARRERA ---

    // 9. /carrera-crear
    else if (commandName === 'carrera-crear') {
        if (carreras.has(user.id)) {
            return await interaction.reply('pará un poco amigo, ya tenés un club creado. usá `/carrera-perfil` para ver cómo vas ⚽');
        }

        const nombreClub = interaction.options.getString('nombre');
        carreras.set(user.id, {
            nombre: nombreClub,
            nivel: 1,
            puntos: 0,
            partidosJugados: 0,
            ganados: 0,
            empatados: 0,
            perdidos: 0
        });

        await interaction.reply(`¡felicitaciones hermano! fundaste **${nombreClub}** 🏆\narrancás en nivel 1. usá `/carrera-entrenar` para subir nivel o `/carrera-partido` para mandar a la cancha a los pibes.`);
    }

    // 10. /carrera-perfil
    else if (commandName === 'carrera-perfil') {
        const datos = carreras.get(user.id);
        if (!datos) {
            return await interaction.reply('todavía no tenés ningún club. armá uno con `/carrera-crear` dale');
        }

        await interaction.reply(
            `⚽ **PERFIL DE MODO CARRERA** ⚽\n` +
            `• **Club:** ${datos.nombre}\n` +
            `• **Nivel de Equipo:** ${datos.nivel} ⭐\n` +
            `• **Puntos de Liga:** ${datos.puntos} pts\n` +
            `• **Historial:** ${datos.ganados}G / ${datos.empatados}E / ${datos.perdidos}P (${datos.partidosJugados} jugados)`
        );
    }

    // 11. /carrera-entrenar
    else if (commandName === 'carrera-entrenar') {
        const datos = carreras.get(user.id);
        if (!datos) {
            return await interaction.reply('primero tenés que crear tu equipo con `/carrera-crear` boludo');
        }

        // Subir de nivel
        datos.nivel += 1;
        await interaction.reply(`metieron turno doble de entrenamiento en la semana. ¡**${datos.nombre}** subió a **Nivel ${datos.nivel}**! 🏋️‍♂️⚽`);
    }

    // 12. /carrera-partido
    else if (commandName === 'carrera-partido') {
        const datos = carreras.get(user.id);
        if (!datos) {
            return await interaction.reply('armá tu club primero con `/carrera-crear` antes de salir a la cancha');
        }

        const rivales = ['Real Suciedad', 'Sacachispas FC', 'Deportivo Humo', 'Unión Fantasma', 'Inter de Caleta Olivia', 'Atlético Catenaccio'];
        const rival = rivales[Math.floor(Math.random() * rivales.length)];

        // Simulación de resultado basado en nivel
        const golesPropios = Math.floor(Math.random() * (datos.nivel + 2));
        const golesRival = Math.floor(Math.random() * 4);

        datos.partidosJugados += 1;

        if (golesPropios > golesRival) {
            datos.ganados += 1;
            datos.puntos += 3;
            await interaction.reply(`¡MAMITA QUERIDA QUÉ PARTIDAZO! **${datos.nombre} ${golesPropios} - ${golesRival} ${rival}** 🏆🔥\nsumaste 3 puntos de oro para la tabla. me vuelvo loco.`);
        } else if (golesPropios === golesRival) {
            datos.empatados += 1;
            datos.puntos += 1;
            await interaction.reply(`empate clavado: **${datos.nombre} ${golesPropios} - ${golesRival} ${rival}** 🤝\nun punto que sirve para sumar, pero faltó potrero al final.`);
        } else {
            datos.perdidos += 1;
            await interaction.reply(`perdiste amigo: **${datos.nombre} ${golesPropios} - ${golesRival} ${rival}** 💀\nterrible pecheada, a llorar a la iglesia. usá \`/carrera-entrenar\` a ver si levantan.`);
        }
    }
});

client.login(TOKEN);
