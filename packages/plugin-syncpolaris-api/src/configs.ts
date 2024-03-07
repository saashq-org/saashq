import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { generateModels } from './connectionResolver';
import { initBroker } from './messageBroker';
import afterMutations from './afterMutations';
import { getSubdomain } from '@saashq/api-utils/src/core';
import * as permissions from './permissions';

export default {
  name: 'syncpolaris',
  permissions,
  graphql: async () => {
    return {
      typeDefs: await typeDefs(),
      resolvers: await resolvers(),
    };
  },
  apolloServerContext: async (context, req) => {
    const subdomain = getSubdomain(req);

    context.subdomain = subdomain;
    context.models = await generateModels(subdomain);

    return context;
  },

  onServerInit: async () => {
    await initBroker();
  },
  meta: {
    afterMutations,
    permissions,
  },
};
