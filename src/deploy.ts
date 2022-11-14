import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import * as url from "url";
import { REST, Routes } from "discord.js";
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
dotenv.config();
const token: string = String(process.env.DISCORD_TOKEN);
const guild: string = String(process.env.GUILD_ID);
const client: string = String(process.env.CLIENT_ID);
const commandsPath: string = path.join(__dirname, "commands");

const commands = [];
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import("file://" + filePath);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(client, guild),
            { body: commands },
        );

        // @ts-ignore
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();