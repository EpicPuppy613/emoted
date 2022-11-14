import {SlashCommandBuilder, ChatInputCommandInteraction} from "discord.js";
// @ts-ignore
import * as mysql from "mysql";

const data = new SlashCommandBuilder()
    .setName('start')
    .setDescription('Start your Emoted adventure (can only be used once)');

const execute = async function (interaction: ChatInputCommandInteraction, query: Function) {
    const rows = await query("SELECT * FROM users WHERE DiscordID=" + interaction.user.id);
    if (rows.length < 1) {
        await query(`INSERT INTO users (DiscordID, Inventory, Gold, Amethyst) VALUES (${interaction.user.id}, "[]", 0, 0)`);
        await interaction.reply({content: "Welcome to Emoted!", ephemeral: false});
    }
    else await interaction.reply({content: "You have already started your Emoted account!", ephemeral: false});
}

export { data, execute };