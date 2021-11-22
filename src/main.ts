require('dotenv').config();
import container from "./inversify.config";
import { TYPES } from "./types";
import { Bot } from "./discord/bot";
import { DatabaseService } from "./database/services/database";
import { Logger } from "./utils/logger";
import { server } from "./api/server";


(async () => {

    const discord_bot = container.get<Bot>(TYPES.DISCORD_BOT);
    const database_service = container.get<DatabaseService>(TYPES.DATABASE_SERVICE);
    const logger = container.get<Logger>(TYPES.LOGGER);
    const api_port = container.get<string>(TYPES.API_PORT);

    await database_service.initialization()
    server
        .build()
        .listen(api_port, () => logger.log("⚡️[INFOS]", `Listen on http://localhost:${api_port}/`));

    discord_bot.listen().then(() => {
        logger.log('⚡️[INFOS]', 'CrappyBird BOT ready to receive incoming commands');

    }).catch((error) => {
        logger.log('[ERROR]', error)
    })
})();
