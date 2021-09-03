const { GraphQLList, GraphQLID } = require("graphql");
const { UserType, PostType, CommentType } = require("./types");
const { User, Post, Comment } = require("../database-model");

const users = {
  type: new GraphQLList(UserType),
  description: "Retrieves list of users",
  async resolve(parent, args) {
    return await User.find();
  },
};

const user = {
  type: UserType,
  description: "Retrieves one user",
  args: { id: { type: GraphQLID } },
  async resolve(parent, args) {
    // console.log(args)
    // console.log(args.id)
    // console.log(typeof(args.id))
    return await User.findById(args.id);
  },
};

const post = {
  type: PostType,
  description: "Retrieves one post",
  args: { id: { type: GraphQLID } },
  async resolve(parent, args) {
    // console.log(args)
    // console.log(args.id)
    // console.log(typeof(args.id))
    return await Post.findById(args.id);
  },
};

const posts = {
  type: new GraphQLList(PostType),
  description: "Retrieves list of posts",
  async resolve(parent, args) {
    return await Post.find().sort({ createdAt: -1 });
  },
};


const commentsToPost = {
  type: new GraphQLList(CommentType),
  description: "Retrieves list of comments which belong to a certain post",
  args: { postId: { type: GraphQLID } },
  async resolve(parent, args) {
    return await Comment.find({ postId: args.postId });
  },
};

const comment = {
  type: CommentType,
  description: "Retrieves one comment",
  args: { id: { type: GraphQLID } },
  async resolve(parent, args) {
    return await Comment.findById(args.id);
  },
};

const comments = {
  type: new GraphQLList(CommentType),
  description: "Retrieves all comments",
  async resolve(parent, args) {
    return await Comment.find().sort({ createdAt: -1 });
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
