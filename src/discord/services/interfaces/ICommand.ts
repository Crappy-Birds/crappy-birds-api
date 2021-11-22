
import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';

export default interface ICommand {
    readonly data: SlashCommandBuilder;
    readonly commandName: string;
    isMatching(commandName: string): boolean;
    execute(command: CommandInteraction): Promise<void>;
}