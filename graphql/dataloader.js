const DataLoader = require("dataloader");
const { groupBy, map } = require("ramda");
const { User, Post, Comment } = require("../database-model");

//the comments dataloader
const commentsDataLoader = () => new DataLoader(commentsByPostIds);
const commentsByPostIds = async (postIds) => {
  let comments;
  try {
    comments = await Comment.find({ postId: { $in: postIds } });
  } catch (err) {
    throw new Error("dataloader commentsByPostIds error");
  }
  //gound comment obj by postId
  const groupById = groupBy((comment) => comment.postId, comments);
  return map((postId) => groupById[postId], postIds);
};

//the posts to users dataloader
const usersDataLoader = () => new DataLoader(usersByUserIds);
const usersByUserIds = async (userIds) => {
  let users;
  try {
    users = await User.find({ _id: { $in: userIds } });
  } catch (err) {
    throw new Error("dataloader usersByUserIds error");
  }

  const groupById = groupBy((user) => user._id, users);
  return map((userId) => groupById[userId], userIds);
};

//the posts dataloader
const postsDataLoader = () => new DataLoader(postsByUserIds);
const postsByUserIds = async (userIds) => {
  let posts;
  try {
    posts = await Post.find({ authorId: { $in: userIds } });
  } catch (err) {
    throw new Error("dataloader usersByUserIds error");
  }

  const groupById = groupBy((post) => post.authorId, posts);
  return map((userId) => groupById[userId], userIds);
};

module.exports = {
  commentsDataLoader,
  usersDataLoader,
  postsDataLoader,
};
