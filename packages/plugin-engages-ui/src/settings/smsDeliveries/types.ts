import { QueryResponse } from '@saashq/ui/src/types';

type SmsStatus = {
  status: string;
  date: Date;
};

export interface ISmsDelivery {
  _id: string;
  createdAt: Date;
  to: string;

  // telnyx data
  status: string;
  responseData?: string;
  telnyxId?: string;
  statusUpdates: [SmsStatus];
  errorMessages: [string];

  // engage only
  engageMessageId?: string;

  // integrations only
  direction?: string;
  from?: string;
  content?: string;
  requestData?: string;
  saashqApiId?: string;
}

interface ISmsDeliveries {
  totalCount: number;
  list: ISmsDelivery[];
}

export type SmsDeliveriesQueryResponse = {
  smsDeliveries: ISmsDeliveries;
} & QueryResponse;
