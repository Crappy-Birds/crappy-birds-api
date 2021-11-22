import { injectable } from "inversify"
import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';

import ICommand from "../interfaces/ICommand"

@injectable()
export class GNCommand implements ICommand {

    readonly commandName: string = "gn";
    readonly data: SlashCommandBuilder = new SlashCommandBuilder()
        .setName(this.commandName)
        .setDescription('good night');

    public isMatching(commandName: string): boolean {
        return this.commandName == commandName
    }

    public async execute(command: CommandInteraction): Promise<void> {
        command.reply('gn birds 😴');
    }

}