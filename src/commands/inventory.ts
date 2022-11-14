import {SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder} from "discord.js";
// @ts-ignore
import * as mysql from "mysql";

const data = new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('Gets the items and currency currently in your inventory.');

const execute = async function (interaction: ChatInputCommandInteraction, query: Function) {
    const rows = await query("SELECT * FROM users WHERE DiscordID=" + interaction.user.id);
    if (rows.length < 1) {
        await interaction.reply({content: "You don't have a Emoted account yet! Use /start to create one", ephemeral: false});
        return;
    }
    const embed = new EmbedBuilder()
        .setColor(0xFFCC4D)
        .setAuthor({ name: interaction.user.username, iconURL: String(interaction.user.avatarURL()) })
        .setTitle("Your Inventory")
        .setDescription(`Emotes: ${JSON.parse(rows[0].Inventory).length}\nGold: ${rows[0].Gold.toLocaleString()}\nAmethyst: ${rows[0].Amethyst.toLocaleString()}`);
    await interaction.reply({embeds: [embed], ephemeral: false});
}

export { data, execute };