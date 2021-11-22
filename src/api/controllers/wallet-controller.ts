import { Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpGet, httpPost, requestBody } from "inversify-express-utils";
import { TYPES } from "../../types";
import { Logger } from "../../utils/logger";
import { ICreateWalletDiscord } from "../interfaces/wallet-discord-interface";
import { getConnection } from "typeorm";
import WalletDiscord from "../../database/entities/wallet-discord";
import { Client, MessageEmbed } from "discord.js";
import { decrypt, encrypt } from "../../utils/crypt"

@controller("/wallet")
export class WalletController {

    constructor(
        @inject(TYPES.LOGGER) private logger: Logger,
        @inject(TYPES.DISCORD_CLIENT) private client: Client,
        @inject(TYPES.DISCORD_BOT_SERVER) private serverId: string,
        @inject(TYPES.PRIVATE_KEY) private privateKey: string,
        @inject(TYPES.EARLY_BIRD_ID) private earlyBirdId: string,

    ) {

    }
    @httpPost("/discord")
    public async index(
        @requestBody() body: ICreateWalletDiscord,
        request: Request,
        response: Response) {
        try {
            let walletDiscord: WalletDiscord | undefined = await getConnection().getRepository(WalletDiscord).findOne({ walletAddress: body.walletAddress })
            if (walletDiscord == undefined) {
                var server = await this.client.guilds.fetch(this.serverId);
                var userId = decrypt(body.discordAddress.toString(), this.privateKey);
                var user = await server.members.fetch(userId);
                if (user) {

                    await user.roles.add(this.earlyBirdId)
                    const newWalletDiscord = new WalletDiscord();
                    newWalletDiscord.discordAddress = userId.toString();
                    newWalletDiscord.walletAddress = body.walletAddress.toString();
                    await getConnection().getRepository(WalletDiscord).save(newWalletDiscord)
                    const embedDm = new MessageEmbed()
                        .setColor('#E682F0')
                        .setTitle('Account Linked !')
                        .setDescription('Early Bird role assigned ! Your discord account is successfuly linked to your wallet.')

                    await user.send({ embeds: [embedDm] });
                    return response.send({
                        type: "success"
                    });
                } else {
                    this.logger.log("[ERROR]", "The user dont exist on server.");
                    return response.status(500).send({
                        type: "error"
                    });
                }


            } else {
                this.logger.log("[ERROR]", "The wallet already registred.");
                return response.status(500).send({
                    type: "error"
                });
            }
        } catch (error) {
            this.logger.log("[ERROR]", error);
        }
    }
}