import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { initBroker } from './messageBroker';
import { getSubdomain } from '@saashq/api-utils/src/core';

export default {
  name: 'dailyco',
  graphql: async () => {
    return {
      typeDefs: await typeDefs(),
      resolvers,
    };
  },
  apolloServerContext: async (context, req): Promise<any> => {
    const subdomain: string = getSubdomain(req);
    context.subdomain = subdomain;
    return context;
  },

  onServerInit: async () => {
    initBroker();
  },
};
