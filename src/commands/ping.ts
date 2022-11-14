import {SlashCommandBuilder, ChatInputCommandInteraction} from "discord.js";
// @ts-ignore
import * as mysql from "mysql";

const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')

const execute = async function (interaction: ChatInputCommandInteraction) {
    const message = await interaction.reply({content: '<a:partyblob:1041076238866993172>', fetchReply: true});
    await message.react("1041076238866993172");
}

export { data, execute };