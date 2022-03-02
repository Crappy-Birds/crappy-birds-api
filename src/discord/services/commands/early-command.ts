import { injectable, inject } from "inversify";
import { CommandInteraction, MessageActionRow, MessageButton } from "discord.js";
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

        const row = new MessageActionRow().addComponents(
            new MessageButton().setCustomId("primary").setLabel("Connect Wallet").setURL(`${this.website.toString()}/${encrypt(command.user.id.toString(), this.privateKey)}`).setStyle("LINK")
        );

        await command.reply({ ephemeral: true, components: [row] });
    }
}
