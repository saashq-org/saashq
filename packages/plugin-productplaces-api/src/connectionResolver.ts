import * as mongoose from 'mongoose';
import { IContext as IMainContext } from '@saashq/api-utils/src';
import { createGenerateModels } from '@saashq/api-utils/src/core';

export interface IModels {}
export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;
  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
