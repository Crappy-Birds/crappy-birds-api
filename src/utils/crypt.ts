import * as crypto from "crypto"
import { buffer } from "stream/consumers";

const algorithm = 'aes-256-ctr';

const encrypt = (value: any, secretKey: any) => {
    var iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(value,'utf8'), cipher.final()]);
    return Buffer.concat([iv,encrypted]).toString('hex');
};

const decrypt = (hash: any, secretKey: any) => {
    var hashBuffer = Buffer.from(hash, 'hex')
    var iv = hash.slice(0, 32);
    var content = hash.slice(32, hash.length * 2)
    const decipher = crypto.createDecipheriv(algorithm, secretKey,Buffer.from(iv,'hex'));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);
    return decrpyted.toString();
};

export {
    encrypt,
    decrypt
};