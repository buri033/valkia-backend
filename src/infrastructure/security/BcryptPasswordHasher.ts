import bcrypt from 'bcryptjs';

export class BcryptPasswordHasher {
  private readonly saltRounds = 10;

  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return bcrypt.hash(password, salt);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
