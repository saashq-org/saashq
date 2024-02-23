import { sendMessage } from '@saashq/api-utils/src/core';
import type {
  MessageArgs,
  MessageArgsOmitService,
} from '@saashq/api-utils/src/core';
import { IContext as IMainContext } from '@saashq/api-utils/src';

import { IModels } from './connectionResolver';
import { afterMutationHandlers } from './afterMutations';
import { consumeQueue } from '@saashq/api-utils/src/messageBroker';

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export const initBroker = async () => {
  consumeQueue('msdynamic:afterMutation', async ({ subdomain, data }) => {
    await afterMutationHandlers(subdomain, data);
    return;
  });
};

export const sendContactsMessage = async (args: MessageArgsOmitService) => {
  return sendMessage({
    serviceName: 'contacts',
    ...args,
  });
};

export const sendProductsMessage = async (
  args: MessageArgsOmitService,
): Promise<any> => {
  return sendMessage({
    serviceName: 'products',
    ...args,
  });
};

export const sendFormsMessage = (
  args: MessageArgsOmitService,
): Promise<any> => {
  return sendMessage({
    serviceName: 'forms',
    ...args,
  });
};

export const sendCoreMessage = async (
  args: MessageArgsOmitService,
): Promise<any> => {
  return sendMessage({
    serviceName: 'core',
    ...args,
  });
};

export const sendCommonMessage = async (args: MessageArgs) => {
  return sendMessage({
    ...args,
  });
};
