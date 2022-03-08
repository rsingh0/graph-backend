import gql from 'graphql-tag';
import comments from './types/comments.js';
import like from './types/like.js';
import mutations from './types/mutations.js';
import post from './types/post.js';
import queries from './types/queries.js'
import user from './types/user.js';

export default gql`
  ${user}
  ${post}
  ${comments}
  ${like}  
  ${queries}
  ${mutations}
`;
