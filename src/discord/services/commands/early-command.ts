import { injectable, inject } from "inversify";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import ICommand from "../interfaces/ICommand";
import { TYPES } from "../../../types";
import { encrypt } from "../../../utils/crypt";

@injectable()
export class EarlyCommand implements ICommand {
    constructor(@inject(TYPES.WEBSITE) private website: String, @inject(TYPES.PRIVATE_KEY) private privateKey: string) {}

    readonly commandName: string = "early";
    readonly data: SlashCommandBuilder = new SlashCommandBuilder().setName(this.commandName).setDescription("Early bird catches the worm");

    public isMatching(commandName: string): boolean {
        return this.commandName == commandName;
    }

    public async execute(command: CommandInteraction): Promise<void> {
        await command.reply(`Sent you a DM <@${command.user.id}>`);
        const embedDm = new MessageEmbed()
            .setColor("#E682F0")
            .setTitle("Connect your account")
            .setDescription(
                `Connect your wallet [here](${this.website.toString()}/${encrypt(
                    command.user.id.toString(),
                    this.privateKey
                )}) to claim the Early Bird role !`
            );
        await command.user.send({ embeds: [embedDm] });
    }
}
