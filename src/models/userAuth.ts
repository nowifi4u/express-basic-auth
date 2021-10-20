import { Sequelize } from 'sequelize';
import { template } from './user';

export default function UserModel(sql: Sequelize) {
  return sql.define('users', {
    id: template.id,
    password: template.password,
    password_timestamp: template.password_timestamp,
    email: template.email,
  });
}

export interface IUserAuth {
  id: string;
  password: string;
  password_timestamp: Date;
  email: string;
}
