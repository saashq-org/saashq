import Mutation from './mutations';
import Query from './queries';
import customScalars from '@saashq/api-utils/src/customScalars';

import Comment from './comment';
const resolvers: any = async () => ({
  ...customScalars,

  Comment,
  Mutation,
  Query
});

export default resolvers;
