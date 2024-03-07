import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';

import { initBroker } from './messageBroker';
import { generateModels } from './connectionResolver';
import * as permissions from './permissions';
import { getSubdomain } from '@saashq/api-utils/src/core';

export default {
  name: 'logs',
  permissions,
  graphql: async () => {
    return {
      typeDefs: await typeDefs(),
      resolvers,
    };
  },
  hasSubscriptions: false,
  segment: {},
  apolloServerContext: async (context, req) => {
    const subdomain = getSubdomain(req);

    context.models = await generateModels(subdomain);
    context.subdomain = subdomain;

    return context;
  },
  onServerInit: async () => {
    initBroker();
  },
  meta: { permissions },
};
