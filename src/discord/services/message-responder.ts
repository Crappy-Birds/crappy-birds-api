import { CommandInteraction, Client } from "discord.js";
import { inject, injectable, named } from "inversify";
import { TYPES } from "../../types";
import ICommand from "./interfaces/ICommand";
import { Routes } from 'discord-api-types/v9';
import { REST } from '@discordjs/rest';

@injectable()
export class MessageResponder {

    private prefix: string;
    private commands: ICommand[];

    constructor(
        @inject(TYPES.DISCORD_CLIENT) private client: Client,
        @inject(TYPES.DISCORD_BOT_TOKEN) token: string,
        @inject(TYPES.DISCORD_BOT_SERVER) private serverId: string,
        @inject(TYPES.DISCORD_BOT_CLIENT) clientId: string,
        @inject(TYPES.DISCORD_COMMAND) @named("GM") gmCommand: ICommand,
        @inject(TYPES.DISCORD_COMMAND) @named("GN") gnCommand: ICommand,
        @inject(TYPES.DISCORD_COMMAND) @named("PING") pingCommand: ICommand,
        @inject(TYPES.DISCORD_COMMAND) @named("EARLY") earlyCommand: ICommand

    ) {

        this.commands = []
        this.commands.push(gmCommand)
        this.commands.push(gnCommand)
        this.commands.push(pingCommand)
        this.commands.push(earlyCommand)


        const rest: any = new REST({ version: '9' }).setToken(token);
        rest.put(Routes.applicationGuildCommands(clientId, serverId), { body: this.commands.map(command => command.data.toJSON()) })
            .then(() => console.log('Successfully registered application commands.'))
            .catch(console.error);

    }

    async handle(command: CommandInteraction): Promise<void> {
        if (!command.isCommand()) return;

        for (const cmd of this.commands) {
            if (!cmd.isMatching(command.commandName)) continue;
            await cmd.execute(command);
        }
    }
}