import { AuthenticationError, UserInputError } from 'apollo-server';
import authorize from '../utils/check-auth.js';
import Post from '../models/post.js';

// @desc Fetch all posts
// @access Public
const getPosts = async () => {
  try {
    console.log('Get all Posts'.blue);
    return await Post.find().sort({ created: -1 });
  } catch (error) {
    console.log('Error fetching Posts'.red);
    throw new Error(error);
  }
};

// @desc Fetch Post By Id
// @access Public
const getPost = async (postId) => {
  try {
    console.log(`Get Post by ${postId}`.blue);
    const post = await Post.findById(postId);

    if (post) {
      return post;
    } else {
      throw new Error('Post not found');
    }
  } catch (error) {
    console.log(`Error fetching Post for ${postId}`.red);
  }
};

// @desc Create Post
// @access Private
const createPost = async (body, context) => {
  // Post should only be created by authorized users
  const user = authorize(context);
  console.log('Authorized User:', user);

  if (!body && !body.trim()) {
    throw new UserInputError('Post body cannot be empty');
  }

  // Create new post
  const newPost = new Post({
    body,
    user: user.id,
    username: user.username,
    createAt: new Date().toISOString(),
  });

  return await newPost.save();
};

// @desc Delete Post by Id
// @access Private
const deletePost = async (postId, context) => {
  // Post should only be deleted by authorized users
  const user = authorize(context);
  console.log('Authorized User:', user);

  try {
    // Verify if Post exists
    const post = await Post.findById(postId);

    // Verify if Post Delete Request is from same person that created that Post
    if (post && post.username === user.username) {
      // Delete Post
      post.delete();
      return 'Post deleted successfully';
    } else {
      throw new AuthenticationError('Action not allowed');
    }
  } catch (error) {
    console.log(`Error deleting Post for ${postId}`.red);
    throw new Error(error);
  }
};

// @desc Like Post
// @access Private
const likePost = async (postId, context) => {
  // Post should only e liked by authorized users
  const { username } = authorize(context);
  console.log('Authorized User:', username);

  const post = await Post.findById(postId);
  if (post && post.likes) {
    const userLikes = post.likes.find((like) => like.username === username);
    if (userLikes) {
      // Post already liked, unlike it
      post.likes = post.like.filter((like) => like.username !== username);
    } else {
      // Like the Post
      post.likes.push({ username, createAt: new Date().toISOString() });
    }

    await post.save();
    return post;
  } else throw new UserInputError('Post not found');
};

export { getPosts, getPost, createPost, deletePost, likePost };
