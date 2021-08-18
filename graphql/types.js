const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} = require("graphql");

const { User, Post, Comment } = require("../database-model");

const UserType = new GraphQLObjectType({
  name: "User",
  description: "User type",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    avatar_url: { type: GraphQLString },
    post: {
      type: new GraphQLList(PostType),
      resolve(parent, args, context) {
        return Post.find({ authorId: parent.id });
      },
    },
  }),
});

const PostType = new GraphQLObjectType({
  name: "Post",
  description: "Post type",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    youtube_url: { type: GraphQLString },
    description: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    author: {
      type: new GraphQLList(UserType),
      resolve(parent, args, context) {
        const { loaders } = context;
        const { usersDataLoader } = loaders;
        return usersDataLoader.load(parent.authorId);
      },
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve(parent, args, context) {
        const { loaders } = context;
        const { commentsDataLoader } = loaders;
        return commentsDataLoader.load(parent.id);
      },
    },
  }),
});

const CommentType = new GraphQLObjectType({
  name: "Comment",
  description: "Comment type",
  fields: () => ({
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      },
    },
    post: {
      type: PostType,
      resolve(parent, args) {
        return Post.findById(parent.postId);
      },
    },
  }),
});

module.exports = {
  UserType,
  PostType,
  CommentType,
  //AuthDataType,
};
