import * as bcrypt from 'bcrypt';
import * as options from '#src/config/bcrypt';

export function generate(password: string): string {
  return bcrypt.hashSync(password, options.saltRounds);
}
