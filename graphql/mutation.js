const { GraphQLString } = require("graphql");

const {} = require("./types");
const { User } = require("../database-model");

const { createJwtToken } = require("../util/auth");

const register = {
  type: GraphQLString,
  args: {
    username: { type: GraphQLString },
    access_token: { type: GraphQLString },
    avatar_url: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const { username, access_token, avatar_url } = args;
    const user = new User({ username, access_token, avatar_url });

    await user.save();
    const token = createJwtToken(user);
    return token;
  },
};

const login = {
  type: GraphQLString,
  args: {
    access_token: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const user = await User.findOne({ access_token: args.access_token });
    if (!user) {
      throw new Error("User is not exist");
    }

    const token = createJwtToken(user);
    return token;
  },
};

module.exports = {
  register,
  login,
};
