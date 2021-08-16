const { GraphQLList, GraphQLID } = require("graphql");
const { UserType, PostType, CommentType } = require("./types");
const { User, Post, Comment } = require("../database-model");

const users = {
  type: new GraphQLList(UserType),
  description: "Retrieves list of users",
  resolve(parent, args) {
    return User.find();
  },
};

const user = {
  type: UserType,
  description: "Retrieves one user",
  args: { id: { type: GraphQLID } },
  resolve(parent, args) {
    return User.findById(args.id);
  },
};

const posts = {
  type: new GraphQLList(PostType),
  description: "Retrieves list of posts",
  resolve(parent, args) {
    return Post.find();
  },
};

const post = {
  type: PostType,
  description: "Retrieves one post",
  args: { id: { type: GraphQLID } },
  resolve(parent, args) {
    return Post.findById(args.id);
  },
};

const commentsToPost = {
  type: new GraphQLList(CommentType),
  description: "Retrieves list of comments which belong to a certain post",
  args: { postId: { type: GraphQLID } },
  resolve(parent, args) {
    return Comment.find({ postId: args.postId });
  },
};

const comment = {
  type: CommentType,
  description: "Retrieves one comment",
  args: { id: { type: GraphQLID } },
  resolve(parent, args) {
    return Comment.findById(args.id);
  },
};

const comments = {
  type: new GraphQLList(CommentType),
  description: "Retrieves all comments",
  resolve(parent, args) {
    return Comment.find();
  },
};

module.exports = {
  users,
  user,
  posts,
  post,
  comments,
  comment,
  commentsToPost,
};
