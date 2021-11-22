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

const container = new Container()

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

container.bind<Client>(TYPES.DISCORD_CLIENT).toConstantValue(client)
container.bind<Bot>(TYPES.DISCORD_BOT).to(Bot).inSingletonScope()
container.bind<Logger>(TYPES.LOGGER).to(Logger).inSingletonScope()
container.bind<DatabaseService>(TYPES.DATABASE_SERVICE).to(DatabaseService).inSingletonScope()

container.bind<String>(TYPES.DISCORD_BOT_TOKEN).toConstantValue(process.env.DISCORD_BOT_TOKEN);
container.bind<String>(TYPES.DISCORD_BOT_SERVER).toConstantValue(process.env.DISCORD_BOT_SERVER);
container.bind<String>(TYPES.DISCORD_BOT_CLIENT).toConstantValue(process.env.DISCORD_BOT_CLIENT);
container.bind<String>(TYPES.WEBSITE).toConstantValue(process.env.WEBSITE);
container.bind<String>(TYPES.PRIVATE_KEY).toConstantValue(process.env.PRIVATE_KEY);
container.bind<String>(TYPES.PRIVATE_IV).toConstantValue(process.env.PRIVATE_IV);
container.bind<String>(TYPES.EARLY_BIRD_ID).toConstantValue(process.env.EARLY_BIRD_ID);

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