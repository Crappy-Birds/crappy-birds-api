import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { Logger } from "../utils/logger";
import { Client, MessageEmbed } from "discord.js";

@injectable()
export class DiscordStats {
    private basic_timestamp: number = 1000 * 60 * 60; //1h

    constructor(
        @inject(TYPES.DISCORD_CLIENT) private client: Client,
        @inject(TYPES.ROLE_EARLY_BIRD_ID) private earlyBirdId: string,
        @inject(TYPES.LOGGER) private logger: Logger,
        @inject(TYPES.DISCORD_STATS_MEMBERS_COUNT) private membersCount: string,
        @inject(TYPES.DISCORD_STATS_EARLY_BIRDS_COUNT) private earlyBirdsCount: string,
        @inject(TYPES.DISCORD_BOT_SERVER) private serverId: string,

    ) {
    }

    public async start() {
        await this.refreshStatsDiscord();
    }
    private async refreshStatsDiscord() {
        setTimeout(async () => {
            try {
                this.logger.log("[StatsDiscord - INFO]", `start execution at ${new Date().toString()}`);
                var server = await this.client.guilds.fetch(this.serverId);
                const channelMembers = await server.channels.fetch(this.membersCount);
                channelMembers.setName(`Members: ${server.memberCount}`);
                const channelEarlyBirds = await server.channels.fetch(this.earlyBirdsCount);
                const members = await server.members.fetch();
                const earlyBirdsCount  = members.filter(member => member.roles.cache.find(role => role.id === this.earlyBirdId) !== undefined).size;
                channelEarlyBirds.setName(`Early birds : ${earlyBirdsCount} / 1500`);
            } catch (error) {
                this.logger.log("[StatsDiscord - ERROR]", error);
            } finally {
                this.logger.log("[StatsDiscord - INFO]", `end execution at ${new Date().toString()}`);
                this.refreshStatsDiscord();
            }

        }, this.basic_timestamp)
    }
}