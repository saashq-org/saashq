import { IModels } from './connectionResolver';
import { debugCallPro, debugError } from './debuggers';
import { getEnv, resetConfigsCache } from './utils';
import fetch from 'node-fetch';

export const removeIntegration = async (
  models: IModels,
  integrationSaasHQApiId: string,
): Promise<string> => {
  const integration = await models.Integrations.findOne({
    saashqApiId: integrationSaasHQApiId,
  });

  if (!integration) {
    throw new Error('Integration not found');
  }

  // Remove endpoint
  let integrationRemoveBy;

  const { _id, kind, saashqApiId } = integration;
  const selector = { integrationId: _id };

  if (kind === 'callpro') {
    debugCallPro('Removing callpro entries');

    await models.CallProConversations.find(selector).distinct('_id');

    integrationRemoveBy = { phoneNumber: integration.phoneNumber };

    await models.CallProCustomers.deleteMany(selector);
    await models.CallProConversations.deleteMany(selector);
  }

  // Remove from core =========
  const ENDPOINT_URL = getEnv({ name: 'ENDPOINT_URL' });
  const DOMAIN = getEnv({ name: 'DOMAIN' });

  if (ENDPOINT_URL) {
    // send domain to core endpoints
    try {
      await fetch(`${ENDPOINT_URL}/remove-endpoint`, {
        method: 'POST',
        body: JSON.stringify({
          domain: DOMAIN,
          ...integrationRemoveBy,
        }),
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  await models.Integrations.deleteOne({ _id });

  return saashqApiId;
};

export const removeAccount = async (
  models: IModels,
  _id: string,
): Promise<{ saashqApiIds: string | string[] } | Error> => {
  const account = await models.Accounts.findOne({ _id });

  if (!account) {
    return new Error(`Account not found: ${_id}`);
  }

  const saashqApiIds: string[] = [];

  const integrations = await models.Integrations.find({
    accountId: account._id,
  });

  if (integrations.length > 0) {
    for (const integration of integrations) {
      try {
        const response = await removeIntegration(
          models,
          integration.saashqApiId,
        );
        saashqApiIds.push(response);
      } catch (e) {
        throw e;
      }
    }
  }

  await models.Accounts.deleteOne({ _id });

  return { saashqApiIds };
};

export const removeCustomers = async (models: IModels, params) => {
  const { customerIds } = params;
  const selector = { saashqApiId: { $in: customerIds } };

  await models.CallProCustomers.deleteMany(selector);
};

export const updateIntegrationConfigs = async (
  models: IModels,
  configsMap,
): Promise<void> => {
  await models.Configs.updateConfigs(configsMap);

  await resetConfigsCache();
};

export const routeErrorHandling = (fn, callback?: any) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (e) {
      if (callback) {
        return callback(res, e, next);
      }

      debugError(e.message);

      return next(e);
    }
  };
};
