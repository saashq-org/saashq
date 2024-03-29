import { Schema, Document } from 'mongoose';
import { field } from './utils';

export interface ICustomer {
  inboxIntegrationId: string;
  primaryPhone: string | number;
  saashqApiId?: string;
}

export interface ICustomerDocument extends ICustomer, Document {}

export const customerSchema: Schema<ICustomerDocument> =
  new Schema<ICustomerDocument>({
    _id: field({ pkey: true }),
    saashqApiId: { type: String, label: 'Customer id at contacts-api' },
    primaryPhone: {
      type: String,
      unique: true,
      label: 'Call primary phone',
    },
    inboxIntegrationId: { type: String, label: 'Inbox integration id' },
  });
