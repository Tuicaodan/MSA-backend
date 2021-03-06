// import required stuff from graphql
const { GraphQLSchema, GraphQLObjectType } = require("graphql");

//import queries
const {
  users,
  user,
  loginedUser,
  posts,
  post,
  comments,
  comment,
  commentsToPost,
} = require("./queries");

//import mutations
const {
  userLogin,
  addPost,
  addComment,
  updatePost,
  deletePost,
  updateComment,
  deleteComment,
} = require("./mutation");

//define QuertType
const QueryType = new GraphQLObjectType({
  name: "QueryType",
  description: "Queries",
  fields: {
    users,
    user,
    loginedUser,
    posts,
    post,
    comments,
    comment,
    commentsToPost,
    },
});

//define MutationType
const MutationType = new GraphQLObjectType({
  name: "MutationType",
  description: "Mutations",
  fields: {
    userLogin,
    addPost,
    addComment,
    updatePost,
    deletePost,
    updateComment,
    deleteComment,
  },
});

module.exports = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
