import { Sequelize } from 'sequelize';
import { template } from './user';

export default function UserModel(sql: Sequelize) {
  return sql.define('users', {
    id: template.id,
    email: template.email,
    pdf: template.pdf,
  });
}

export interface IUserPdf {
  id: string;
  email: string;
  pdf: Buffer | null;
}
