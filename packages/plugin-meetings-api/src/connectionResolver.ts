import { IMeetingModel, loadMeetingClass } from './models/Meetings';
import * as mongoose from 'mongoose';
import { IMeetingDocument } from './models/definitions/meeting';
import { createGenerateModels } from '@saashq/api-utils/src/core';
import { ITopicModel, loadTopicClass } from './models/Topics';
import { ITopicDocument } from './models/definitions/topic';
import { IPinnedUserDocument } from './models/definitions/pinnerUser';
import { IPinnedUserModel, loadPinnedUserClass } from './models/pinnedUsers';

export interface IModels {
  Meetings: IMeetingModel;
  Topics: ITopicModel;
  PinnedUsers: IPinnedUserModel;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.Meetings = db.model<IMeetingDocument, IMeetingModel>(
    'meetings',
    loadMeetingClass(models),
  );
  models.Topics = db.model<ITopicDocument, ITopicModel>(
    'meeting_topics',
    loadTopicClass(models),
  );

  models.PinnedUsers = db.model<IPinnedUserDocument, IPinnedUserModel>(
    'meeting_pinned_users',
    loadPinnedUserClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
