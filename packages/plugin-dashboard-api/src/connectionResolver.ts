import * as mongoose from 'mongoose';
import {
  IDashboardDocumentz,
  IDashboardItemDocument,
} from './models/definitions/dashboardz';
import {
  IDashboardModelz,
  IDashboardItemModel,
  loadDashboardClass,
  loadDashboardItemClass,
} from './models/Dashboard';
import { IContext as IMainContext } from '@saashq/api-utils/src';
import { createGenerateModels } from '@saashq/api-utils/src/core';

export interface IModels {
  Dashboards: IDashboardModelz;
  DashboardItems: IDashboardItemModel;
}
export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export let models: IModels | null = null;

export const loadClasses = (db: mongoose.Connection): IModels => {
  models = {} as IModels;

  models.Dashboards = db.model<IDashboardDocumentz, IDashboardModelz>(
    'dashboards',
    loadDashboardClass(models),
  );

  models.DashboardItems = db.model<IDashboardItemDocument, IDashboardItemModel>(
    'dashboard_items',
    loadDashboardItemClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
