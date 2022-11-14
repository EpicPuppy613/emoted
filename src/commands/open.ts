import {SlashCommandBuilder, ChatInputCommandInteraction} from "discord.js";
// @ts-ignore
import * as mysql from "mysql";

const data = new SlashCommandBuilder()
    .setName('open')
    .setDescription('Opens a pack (test command)!')

const execute = async function (interaction: ChatInputCommandInteraction, query: Function) {
    await interaction.reply("Rolling...");
    const table = await query("SELECT * FROM standard;");
    let totalWeight = 0;
    for (const item of table) {
        totalWeight += item.Weight;
    }
    let output = [];
    for (let x = 0; x < 10; x++) {
        let roll = Math.floor(Math.random() * totalWeight + 1);
        let i = 0;
        while (roll > table[i].Weight) {
            roll -= table[i].Weight;
            i++;
        }
        let emote = await query("SELECT * FROM emotes WHERE ID='" + table[i].ID + "'");
        output.push(emote[0]);
    }
    let outstring = "";
    for (const roll of output) {
        outstring += roll.ChatString;
    }
    outstring += "\n";
    for (const roll of output) {
        switch(roll.Rarity) {
            case "c":
                outstring += ":white_large_square:";
                break;
            case "u":
                outstring += ":green_square:";
                break;
            case "r":
                outstring += ":blue_square:";
                break;
            case "e":
                outstring += ":purple_square:";
                break;
            case "l":
                outstring += ":orange_square:";
                break;
            case "m":
                outstring += ":red_square:";
                break;
        }
    }
    await interaction.editReply(outstring);
}

export { data, execute };