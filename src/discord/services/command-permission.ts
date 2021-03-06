import { CommandInteraction, Client } from "discord.js";
import { inject, injectable, named } from "inversify";
import { TYPES } from "../../types";
import { Logger } from "../../utils/logger";
import ICommand from "./interfaces/ICommand";

@injectable()
export class CommandPermission {

    constructor(
        @inject(TYPES.DISCORD_CLIENT) private client: Client,
        @inject(TYPES.DISCORD_BOT_SERVER) private serverId: string,
        @inject(TYPES.ROLE_NESTLING_ID) private nestlingId: string,
        @inject(TYPES.ROLE_EVERYONE_ID) private everyOneId: string,
        @inject(TYPES.LOGGER) private logger: Logger,

    ) {

    }

    async handle(): Promise<void> {
        var guild = await this.client.guilds.fetch(this.serverId)
        await guild.commands.permissions.set({
            fullPermissions: [
            ]
        })

        await (await guild.commands.fetch()).forEach(async commandSlash => {
            if(commandSlash.name == "early"){
                await commandSlash.permissions.add({
                    permissions: [{
                        id: this.nestlingId,
                        type: 'ROLE',
                        permission: true
                    }]
                })
            }else{              
                await commandSlash.permissions.add({
                    permissions: [{
                        id: this.everyOneId,
                        type: 'ROLE',
                        permission: true
                    }]
                })
            }           
        });


        this.logger.log("⚡️[INFOS]","Command manager loaded.")
    }
}