import { injectable, inject } from "inversify"
import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';
import ICommand from "../interfaces/ICommand"
import { TYPES } from "../../../types";
import { encrypt } from "../../../utils/crypt"

@injectable()
export class EarlyCommand implements ICommand {

    constructor(
        @inject(TYPES.WEBSITE) private website: String,
        @inject(TYPES.PRIVATE_KEY) private privateKey: string,
        @inject(TYPES.PRIVATE_IV) private  privateIV: string,

    ) {
    }

    readonly commandName: string = "early";
    readonly data: SlashCommandBuilder = new SlashCommandBuilder()
        .setName(this.commandName)
        .setDescription('Early bird catches the worm');

    public isMatching(commandName: string): boolean {
        return this.commandName == commandName;
    }

    public async execute(command: CommandInteraction): Promise<void> {
        await command.reply(`Sent you a DM <@${command.user.id}>`);
        const embedDm = new MessageEmbed()
            .setColor('#ff0090')
            .setTitle('Connect your account')
            .setURL(`${this.website.toString()}/wallet/${encrypt(Buffer.from(command.user.id, 'utf8'),this.privateKey,this.privateIV)}`)
            .setDescription('allows you to link your wallet with the discord account and benefit from an early-bird role');
        await command.user.send({ embeds: [embedDm] });
        //await command.member.roles.push(process.env.EARLY_BIRD_ROLE_ID);
    }

}