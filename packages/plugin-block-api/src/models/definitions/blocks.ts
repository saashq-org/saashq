import { Document, Schema } from 'mongoose';
import { field } from './utils';

export interface IBlock {
  saashqCustomerId: string;
  isVerified: string;
  balance: number;
}

export interface IBlockDocument extends IBlock, Document {
  _id: string;
}

export const blockSchema = new Schema({
  _id: field({ pkey: true }),
  saashqCustomerId: field({
    type: String,
    label: 'Customer'
  }),
  balance: field({ type: Number, label: 'Balance', optional: true }),
  isVerified: field({ type: String, label: 'Verified', optional: true })
});
