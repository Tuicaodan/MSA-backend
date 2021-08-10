const { GraphQLString } = require("graphql");

const { PostType, UserType, CommentType } = require("./types");
const { User, Post, Comment } = require("../database-model");

const { createJwtToken } = require("../util/auth");

const register = {
  type: GraphQLString,
  description: "register user",
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
  description: "login user",
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

const addPost = {
  type: PostType,
  description: "create a new post",
  args: {
    title: { type: GraphQLString },
    youtube_uri: { type: GraphQLString },
  },
  resolve(parent, args, { verifiedUser }) {
    console.log("Verified User: ", verifiedUser);
    if (!verifiedUser) {
      throw new Error("Unauthorized");
    }
    const post = new Post({
      authorId: verifiedUser._id,
      title: args.title,
      youtube_uri: args.youtube_uri,
    });
    return post.save();
  },
};

module.exports = {
  register,
  login,
  addPost,
};
