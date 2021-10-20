import { ModelAttributes, Sequelize, default as sequelize } from 'sequelize';
const { DataTypes } = sequelize;

export const template: ModelAttributes = {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    unique: true,
    defaultValue: DataTypes.UUIDV4,
  },
  password: {
    type: DataTypes.STRING(72),
    allowNull: false,
  },
  passwordAt: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  email: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  firstName: {
    type: DataTypes.STRING(32),
    allowNull: false,
    validate: {
      min: 2,
      isAlpha: true,
    },
  },
  lastName: {
    type: DataTypes.STRING(32),
    allowNull: false,
    validate: {
      min: 2,
      isAlpha: true,
    },
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imageType: {
    type: DataTypes.STRING(32),
    allowNull: true,
    validate: {
      is: /^image/,
    },
  },
  pdf: {
    type: DataTypes.BLOB,
    allowNull: true,
  },
};

export default function UserModel(sql: Sequelize) {
  return sql.define('users', template);
}

export interface IUser {
  id: string;
  password: string;
  passwordAt: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string | null;
  imageType: string | null;
  pdf: Buffer | null;
}
