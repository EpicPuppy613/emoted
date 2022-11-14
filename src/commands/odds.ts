import {SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder} from "discord.js";
// @ts-ignore
import * as mysql from "mysql";

const data = new SlashCommandBuilder()
    .setName('odds')
    .setDescription('Gets the odds of getting a certain rarity of emote.');

const execute = async function (interaction: ChatInputCommandInteraction, query: Function) {
    const table = await query("SELECT * FROM standard;");
    let totalWeight = 0;
    let rarities = {
        "c": 0,
        "u": 0,
        "r": 0,
        "e": 0,
        "l": 0,
        "m": 0
    }
    for (const item of table) {
        totalWeight += item.Weight;
        // @ts-ignore
        rarities[item.ID[4]] += item.Weight;
    }
    const embed = new EmbedBuilder()
        .setTitle("Standard Pack Rarity Table")
        .setColor(0xFFCC4D)
        .setDescription(`:white_large_square: Common: ${(rarities.c / totalWeight * 100).toFixed(2)}%
:green_square: Uncommon: ${(rarities.u / totalWeight * 100).toFixed(2)}%
:blue_square: Rare: ${(rarities.r / totalWeight * 100).toFixed(2)}%
:purple_square: Epic: ${(rarities.e / totalWeight * 100).toFixed(2)}%
:orange_square: Legendary: ${(rarities.l / totalWeight * 100).toFixed(2)}%
:red_square: Mythic: ${(rarities.m / totalWeight * 100).toFixed(2)}%`);
    await interaction.reply({embeds: [embed]});
}

export { data, execute };