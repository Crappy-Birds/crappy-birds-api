import "reflect-metadata";
import { Container } from "inversify";
import { Client, Intents } from 'discord.js';
import { TYPES } from "./types";
import { Bot } from "./discord/bot";
import { MessageResponder } from "./discord/services/message-responder";
import { GNCommand, GMCommand, PingCommand, EarlyCommand } from "./discord/services/commands";
import ICommand from "./discord/services/interfaces/ICommand";
import { Logger } from "./utils/logger";
import { DatabaseService } from "./database/services/database";
import "./api/controllers/wallet-controller";
import { CommandPermission } from "./discord/services/command-permission";
import { DiscordStats } from "./jobs/discord-stats";

const container = new Container()
const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MEMBERS] });

container.bind<Client>(TYPES.DISCORD_CLIENT).toConstantValue(client)
container.bind<Bot>(TYPES.DISCORD_BOT).to(Bot).inSingletonScope()
container.bind<Logger>(TYPES.LOGGER).to(Logger).inSingletonScope()
container.bind<DatabaseService>(TYPES.DATABASE_SERVICE).to(DatabaseService).inSingletonScope()
container.bind<CommandPermission>(TYPES.DISCORD_COMMAND_PERMISSION).to(CommandPermission).inSingletonScope()
container.bind<DiscordStats>(TYPES.DISCORD_STATS).to(DiscordStats).inSingletonScope()


container.bind<String>(TYPES.DISCORD_BOT_TOKEN).toConstantValue(process.env.DISCORD_BOT_TOKEN);
container.bind<String>(TYPES.DISCORD_BOT_SERVER).toConstantValue(process.env.DISCORD_BOT_SERVER);
container.bind<String>(TYPES.DISCORD_BOT_CLIENT).toConstantValue(process.env.DISCORD_BOT_CLIENT);
container.bind<String>(TYPES.WEBSITE).toConstantValue(process.env.WEBSITE);
container.bind<String>(TYPES.PRIVATE_KEY).toConstantValue(process.env.PRIVATE_KEY);
container.bind<String>(TYPES.ROLE_EARLY_BIRD_ID).toConstantValue(process.env.ROLE_EARLY_BIRD_ID);
container.bind<String>(TYPES.ROLE_EVERYONE_ID).toConstantValue(process.env.ROLE_EVERYONE_ID);
container.bind<String>(TYPES.ROLE_NESTLING_ID).toConstantValue(process.env.ROLE_NESTLING_ID);
container.bind<String>(TYPES.DISCORD_STATS_MEMBERS_COUNT).toConstantValue(process.env.DISCORD_STATS_MEMBERS_COUNT);
container.bind<String>(TYPES.DISCORD_STATS_EARLY_BIRDS_COUNT).toConstantValue(process.env.DISCORD_STATS_EARLY_BIRDS_COUNT);
container.bind<String>(TYPES.DISCORD_STATS_EARLY_BIRDS_MAX).toConstantValue(process.env.DISCORD_STATS_EARLY_BIRDS_MAX);

container.bind<String>(TYPES.DB_HOST).toConstantValue(process.env.DB_HOST);
container.bind<String>(TYPES.DB_NAME).toConstantValue(process.env.DB_NAME);
container.bind<String>(TYPES.DB_PASSWORD).toConstantValue(process.env.DB_PWD);
container.bind<String>(TYPES.DB_PORT).toConstantValue(process.env.DB_PORT);
container.bind<String>(TYPES.DB_TYPE).toConstantValue(process.env.DB_TYPE);
container.bind<String>(TYPES.DB_USER).toConstantValue(process.env.DB_USER);
container.bind<String>(TYPES.API_PORT).toConstantValue(process.env.API_PORT);

container.bind<MessageResponder>(TYPES.DISCORD_MESSAGE_RESPONDER).to(MessageResponder).inSingletonScope()

container.bind<ICommand>(TYPES.DISCORD_COMMAND).to(GMCommand).whenTargetNamed("GM")
container.bind<ICommand>(TYPES.DISCORD_COMMAND).to(GNCommand).whenTargetNamed("GN")
container.bind<ICommand>(TYPES.DISCORD_COMMAND).to(PingCommand).whenTargetNamed("PING")
container.bind<ICommand>(TYPES.DISCORD_COMMAND).to(EarlyCommand).whenTargetNamed("EARLY")

export default container;