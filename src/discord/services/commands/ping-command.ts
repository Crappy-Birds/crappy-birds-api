import { injectable } from "inversify"
import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';

import ICommand from "../interfaces/ICommand"

@injectable()
export class PingCommand implements ICommand {

    readonly commandName: string = "ping";
    readonly data: SlashCommandBuilder = new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with pong!');

    public isMatching(commandName: string): boolean {
        return this.commandName == commandName
    }

    public async execute(command: CommandInteraction): Promise<void> {
        command.reply('pong 🏓');
    }

}