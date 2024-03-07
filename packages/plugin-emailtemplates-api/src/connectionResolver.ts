import * as mongoose from 'mongoose';

import { IEmailTemplateDocument } from './models/definitions/emailTemplates';
import {
  IEmailTemplateModel,
  loadEmailTemplateClass,
} from './models/EmailTemplates';
import { IContext as IMainContext } from '@saashq/api-utils/src';
import { createGenerateModels } from '@saashq/api-utils/src/core';

export interface IModels {
  EmailTemplates: IEmailTemplateModel;
}
export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.EmailTemplates = db.model<IEmailTemplateDocument, IEmailTemplateModel>(
    'email_templates',
    loadEmailTemplateClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
