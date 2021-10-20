import { Sequelize } from 'sequelize';
import { template } from './user';

export default function UserModel(sql: Sequelize) {
  return sql.define('users', {
    id: template.id,
    password: template.password,
    passwordAt: template.passwordAt,
    email: template.email,
  });
}

export interface IUserAuth {
  id: string;
  password: string;
  passwordAt: Date;
  email: string;
}
