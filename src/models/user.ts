import { Model, ModelAttributes, Sequelize } from 'sequelize';
import { DataType } from 'sequelize-typescript';

export const template: ModelAttributes<Model, Model['_attributes']> = {
  id: {
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  },
  password: {
    type: DataType.STRING(72),
    allowNull: false,
  },
  password_timestamp: {
    type: DataType.TIME,
    allowNull: false,
    defaultValue: DataType.NOW,
  },
  email: {
    type: DataType.STRING(64),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  firstName: {
    type: DataType.STRING(32),
    allowNull: false,
    validate: {
      min: 2,
      isAlpha: true,
    },
  },
  lastName: {
    type: DataType.STRING(32),
    allowNull: false,
    validate: {
      min: 2,
      isAlpha: true,
    },
  },
  image: {
    type: DataType.TEXT,
    allowNull: true,
  },
  pdf: {
    type: DataType.BLOB,
    allowNull: true,
  },
};

export default function UserModel(sql: Sequelize) {
  return sql.define('users', template);
}

export interface IUser {
  id: string;
  password: string;
  password_timestamp: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string | null;
  pdf: Buffer | null;
}
