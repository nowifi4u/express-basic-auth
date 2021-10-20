import { Sequelize } from 'sequelize';
import { models } from '#src/models/index';
import * as config from '#src/config/db';
import { IModels } from '#src/interfaces/models';
import { objectMap } from '#src/util/object';

export const sql = new Sequelize(config.database, config.username, config.password, config.options);

const _models = objectMap(models, m => m(sql));
export const db: IModels<typeof _models> = _models;
