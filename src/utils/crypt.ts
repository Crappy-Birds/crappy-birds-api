import * as crypto from "crypto"

const algorithm = 'aes-256-ctr';

const encrypt = (value: any, secretKey: any, secretIV: any) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, secretIV);
    const encrypted = Buffer.concat([cipher.update(value), cipher.final()]);
    return encrypted.toString('hex');
};

const decrypt = (hash: any, secretKey: any, secretIV: any) => {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(secretIV, 'hex'));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
    return decrpyted.toString();
};

export {
    encrypt,
    decrypt
};