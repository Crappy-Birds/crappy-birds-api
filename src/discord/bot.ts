import { Client, Message } from "discord.js"
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { CommandPermission } from "./services/command-permission";
import { MessageResponder } from "./services/message-responder";

@injectable()
export class Bot {

    private client: Client;
    private readonly token: string;
    private messageResponder: MessageResponder;

    constructor(
        @inject(TYPES.DISCORD_CLIENT) client: Client,
        @inject(TYPES.DISCORD_BOT_TOKEN) token: string,
        @inject(TYPES.DISCORD_MESSAGE_RESPONDER) messageResponder: MessageResponder,
        @inject(TYPES.DISCORD_COMMAND_PERMISSION) private commandPermission: CommandPermission

    ) {
        this.client = client;
        this.token = token;
        this.messageResponder = messageResponder;
    }

    public listen(): Promise<string> {

        this.client.on('ready', async() => {
            this.commandPermission.handle();
        });

        this.client.on('interactionCreate', async interaction => {
            if (!interaction.isCommand()) return;
            this.messageResponder.handle(interaction)
        });

        return this.client.login(this.token)
    }


}