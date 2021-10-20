import { Model, ModelCtor, Sequelize } from 'sequelize/types';

export type IModelConstructors<T> = { [key in keyof T]: (sql: Sequelize) => ModelCtor<Model<any, any>> };
export type IModels<T> = { [key in keyof T]: ModelCtor<Model<any, any>> };
