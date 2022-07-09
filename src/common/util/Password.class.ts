import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

export class Password {
  static async createHash(password: string): Promise<string> {
    // create salt
    const salt = randomBytes(32).toString('hex');
    // create hash
    const hash = (await scrypt(salt, password, 32)) as Buffer;
    // return hash password
    return `${salt}.${hash.toString('hex')}`;
  }

  static async validateHash(password: string, storedPassword: string): Promise<boolean> {
    // get salt and password
    const [salt, storedHash] = storedPassword.split('.');

    // create hash
    const hash = (await scrypt(salt, password, 32)) as Buffer;

    //return compare of the hash
    return storedHash === hash.toString('hex');
  }
}
