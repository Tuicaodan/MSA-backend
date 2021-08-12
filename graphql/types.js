const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} = require("graphql");

const { User, Post, Comment } = require("../database-model");

// const AuthDataType = new GraphQLObjectType({
//   name: "AuthData",
//   description: "Auth data type",
//   fields: () => ({
//     jwt_token: { type: GraphQLString },
//     id: { type: GraphQLID },
//     username: { type: GraphQLString },
//     avatar_url: { type: GraphQLString },
//   })
// });

const UserType = new GraphQLObjectType({
  name: "User",
  description: "User type",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    avatar_url: { type: GraphQLString },
    post: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
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
    youtube_uri: { type: GraphQLString },
    author: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.authorId);
      },
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve(parent, args) {
        return Comment.find({ postId: parent.id });
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
