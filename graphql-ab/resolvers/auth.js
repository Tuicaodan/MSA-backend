const { createJwtToken } = require("../../util/jwt-auth");
const { User } = require("../../database-model");
const { getAccessToken, getGithubUser } = require("../../util/oauth-functions");

module.exports = {
  userLogin: async (args) => {
    if (!args.code) {
      throw new Error("Bad access code from github");
    }

    const access_token = await getAccessToken(
      args.code,
      process.env.GITHUB_CLIENT_ID,
      process.env.GITHUB_CLIENT_SECRET
    );
    if (!access_token) {
      throw new Error("Bad access token from github");
    }
    //console.log(access_token);

    const githubUserdata = await getGithubUser(access_token);
    if (!githubUserdata.login) {
      throw new Error("Bad access token from github");
    }
    const loginUser = {
      username: githubUserdata.login,
      avatar_url: githubUserdata.avatar_url,
    };

    let databaseUser = await User.findOne({ username: loginUser.username });
    //console.log(databaseUser);
    if (!databaseUser) {
      console.log("creating user");
      databaseUser = new User(loginUser);
      await databaseUser.save();
    }

    const token = createJwtToken(databaseUser);

    const AuthData = {
      jwt_token: token,
      id: databaseUser._id,
      username: databaseUser.username,
      avatar_url: databaseUser.avatar_url,
    };

    return AuthData;
  },
};
