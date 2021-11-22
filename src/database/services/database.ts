import "reflect-metadata";
import { createConnection } from "typeorm";
import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { Logger } from "../../utils/logger";
@injectable()
export class DatabaseService {

    constructor(
        @inject(TYPES.LOGGER) private logger: Logger,
        @inject(TYPES.DB_HOST) private DB_HOST: string,
        @inject(TYPES.DB_PORT) private DB_PORT: string,
        @inject(TYPES.DB_USER) private DB_USER: string,
        @inject(TYPES.DB_PASSWORD) private DB_PASSWORD: string,
        @inject(TYPES.DB_NAME) private DB_NAME: string,
        @inject(TYPES.DB_TYPE) private DB_TYPE: string,
    ) {
    }

    public async initialization(): Promise<void> {

        return new Promise((res) => {
            createConnection({
                type: this.DB_TYPE as any,
                host: this.DB_HOST,
                port: parseInt(this.DB_PORT),
                username: this.DB_USER,
                password: this.DB_PASSWORD,
                database: this.DB_NAME,
                entities: [
                    "dist/database/entities/*.js"
                ],
                synchronize: false,
                logging: false
            }).then(() => {
                this.logger.log('⚡️[db]',`Database is connected and loaded at ${this.DB_HOST}:${this.DB_PORT} (${this.DB_NAME}:${this.DB_TYPE})`);
                res()
            }).catch(error => this.logger.log('[ERROR]',error));
        });
    }
}