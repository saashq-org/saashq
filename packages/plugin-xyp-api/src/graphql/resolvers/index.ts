import customScalars from '@saashq/api-utils/src/customScalars';

import mutations from './mutations';
import queries from './queries';
import { IContext } from '../../connectionResolver';

const XypData = {
  async __resolveReference({ _id }, { models }: IContext) {
    const customer = await models.XypData.findOne({ _id });
    return customer;
  }
};

const resolvers: any = async () => ({
  ...customScalars,
  XypData,
  Mutation: {
    ...mutations
  },
  Query: {
    ...queries
  }
});

export default resolvers;
