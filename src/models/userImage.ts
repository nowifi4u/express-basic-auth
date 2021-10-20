import { Sequelize } from 'sequelize';
import { template } from './user';

export default function UserModel(sql: Sequelize) {
  return sql.define('users', {
    id: template.id,
    email: template.email,
    image: template.image,
    imageType: template.imageType,
  });
}

export interface IUserImage {
  id: string;
  email: string;
  image: string | null;
  imageType: string | null;
}
