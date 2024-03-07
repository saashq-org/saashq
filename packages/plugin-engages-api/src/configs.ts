import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers/index';
import telnyx from './api/telnyx';
import { engageTracker } from './trackers/engageTracker';
import { initBroker } from './messageBroker';
import { generateModels } from './connectionResolver';
import tags from './tags';
import logs from './logUtils';
import cronjobs from './cronjobs/engages';
import * as permissions from './permissions';
import { getSubdomain } from '@saashq/api-utils/src/core';
import webhooks from './webhooks';
import app from '@saashq/api-utils/src/app';

export default {
  name: 'engages',
  permissions,
  graphql: async () => {
    return {
      typeDefs: await typeDefs(),
      resolvers,
    };
  },
  segment: { schemas: [] },
  hasSubscriptions: false,
  meta: { tags, logs: { consumers: logs }, webhooks, cronjobs, permissions },
  postHandlers: [{ path: `/service/engage/tracker`, method: engageTracker }],
  apolloServerContext: async (context, req) => {
    const subdomain = getSubdomain(req);

    context.dataloaders = {};

    context.models = await generateModels(subdomain);
    context.subdomain = subdomain;

    return context;
  },
  onServerInit: async () => {
    // Insert routes below
    app.use('/telnyx', telnyx);

    initBroker();
  },
};
