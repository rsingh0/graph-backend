import posts from './posts.js'

const resolvers = {
  Query: {
    ...posts.Query,
  },
};

export default resolvers;
