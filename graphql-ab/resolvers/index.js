const authResolver = require("./auth");
const postsResolver = require("./posts");
//const commentsResolver = require('./booking');

const rootResolver = {
  ...authResolver,
  ...postsResolver,
};

module.exports = rootResolver;
