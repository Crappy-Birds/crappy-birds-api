import { injectable } from "inversify";

@injectable()
class Logger {
    log(type: string, message: string): void {
        const time = new Date().toISOString();
        console.log(`${type} : ${time} -- ${message}`);
    }
}

export {Logger}