//Imports and environment variables
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
// @ts-ignore
import * as mysql from "mysql";
import {promisify} from "util";
import {Client, Collection, Events, GatewayIntentBits, SlashCommandBuilder} from "discord.js";
dotenv.config();
const token = process.env.DISCORD_TOKEN;
const commandsPath: string = path.join(__dirname, "commands");

type Command = {
    data: SlashCommandBuilder,
    execute: Function
}

//Create a new client instance
const B = {
    client: new Client({ intents: [GatewayIntentBits.Guilds] }),
    commands: new Collection<string,Command>(),
    log: function (type:string, message:string) {
        const now = new Date();
        console.log(`[${now.toLocaleString()}][${type.toUpperCase()}] ${message}`);
    },
    database: mysql.createPool({
        connectionLimit: 10, host: process.env.DATABASE_HOST, user: process.env.DATABASE_USER, password: process.env.DATABASE_PASSWORD, database: "sys"
    })
};

//Load command files
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import("file://" + filePath);
    if ('data' in command && 'execute' in command) {
        B.commands.set(command.data.name, command);
    } else {
        B.log("warn", `The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

//Run when client ready
B.client.once(Events.ClientReady, c => {
    B.log("info", `Logged in as ${c.user.tag}`);
});

//Process interactions
B.client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = B.commands.get(interaction.commandName);

    if (!command) {
        B.log("error", `No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        B.database.getConnection(async function(err: any, connection: any) {
            if (err) throw err;
            await command.execute(interaction, promisify(connection.query).bind(connection));
            connection.release();
        })

    } catch (error: any) {
        B.log("error", error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
})

//Log into Discord with token
B.client.login(token);