const { GraphQLList } = require("graphql");
const { UserType } = require("./types");
const { User } = require("../database-model");

const users = {
  type: new GraphQLList(UserType),
  resolve(parent, args) {
    return User.find();
  },
};

module.exports = {
  users,
};
