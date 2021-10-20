import { Sequelize } from 'sequelize';
import { template } from './user';

export default function UserModel(sql: Sequelize) {
  return sql.define('users', {
    id: template.id,
    email: template.email,
    firstName: template.firstName,
    lastName: template.lastName,
  });
}

export interface IUserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}
