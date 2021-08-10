// import required stuff from graphql
const { GraphQLSchema, GraphQLObjectType } = require("graphql");

//import queries
const { users } = require("./queries");

//import mutations
const { register, login, } = require("./mutation");

//define QuertType
const QueryType = new GraphQLObjectType({
  name: "QueryType",
  description: "Queries",
  fields: { users },
});

//define MutationType
const MutationType = new GraphQLObjectType({
  name: "MutationType",
  description: "Mutations",
  fields: { register, login },
});

module.exports = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
