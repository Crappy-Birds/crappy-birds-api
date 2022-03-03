import { injectable } from "inversify";
import DailyRotateFile from 'winston-daily-rotate-file';
import *  as  winston from 'winston';

@injectable()
class Logger {
    private logger: winston.Logger = null;
    constructor() {
        const transport: DailyRotateFile = new DailyRotateFile({
            filename: 'application-%DATE%.log',
            dirname: './logs/',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        });
        this.logger = winston.createLogger({
            transports: [
                transport
            ]
        });
    }
    log(type: string, message: string): void {
        this.logger.info(`${type} - ${message}`)
    }
}

export { Logger }