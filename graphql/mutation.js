const { GraphQLString } = require("graphql");
const { PostType, UserType, CommentType } = require("./types");
const { User, Post, Comment } = require("../database-model");
const { createJwtToken } = require("../util/jwt-auth");

const { getAccessToken, getGithubUser } = require("../util/oauth-functions");

const userLogin = {
  type: GraphQLString,
  description: "login user, if user not exist, create user",
  args: {
    code: { type: GraphQLString },
  },
  async resolve(parent, args) {
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

    return JSON.stringify(AuthData);
  },
};

const addPost = {
  type: PostType,
  description: "create a new post",
  args: {
    title: { type: GraphQLString },
    youtube_url: { type: GraphQLString },
    description: { type: GraphQLString },
  },
  async resolve(parent, args, { verifiedUser }) {
    console.log("in the mutation addPost")
    console.log("Verified User: ", verifiedUser);
    if (!verifiedUser) {
      throw new Error("Unauthenticated");
    }
    const post = new Post({
      authorId: verifiedUser._id,
      title: args.title,
      youtube_url: args.youtube_url,
      description: args.description,
    });
    try{
      const result = await post.save()
      //console.log(result);
      return result;
    }catch(err){
      console.log("Adding post error in server: "+ err);
      throw new Error(err)
    }
    
    // return post
    //   .save()
    //   .then((result) => {
    //     console.log(result);
    //     return { ...result._doc };
    //   })
    //   .catch((err) => {
    //     console.log("Adding post error");
    //     throw err;
    //   });
  },
};

const updatePost = {
  type: PostType,
  description: "update a post, only the author can update it",
  args: {
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    youtube_url: { type: GraphQLString },
    description: { type: GraphQLString },
  },
  async resolve(parent, args, { verifiedUser }) {
    if (!verifiedUser) {
      throw new Error("Unauthenticated");
    }

    const postUpdated = await Post.findOneAndUpdate(
      {
        _id: args.id,
        authorId: verifiedUser._id,
      },
      {
        title: args.title,
        youtube_url: args.youtube_url,
        description: args.description,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!postUpdated) {
      throw new Error("No post with the give ID found for the author");
    }

    return postUpdated;
  },
};

const deletePost = {
  type: GraphQLString,
  description: "delete post",
  args: {
    id: { type: GraphQLString },
  },
  async resolve(parent, args, { verifiedUser }) {
    if (!verifiedUser) {
      throw new Error("Unauthenticated");
    }

    const postDeleted = await Post.findOneAndDelete({
      _id: args.id,
      authorId: verifiedUser._id,
    });

    if (!postDeleted) {
      throw new Error("No post with the give ID found for the author");
    }

    return "Post deleted";
  },
};

const addComment = {
  type: CommentType,
  description: "create a new comment on the post",
  args: {
    comment: { type: GraphQLString },
    postId: { type: GraphQLString },
  },
  resolve(parent, args, { verifiedUser }) {
    if (!verifiedUser) {
      throw new Error("Unauthenticated");
    }
    const comment = new Comment({
      userId: verifiedUser._id,
      postId: args.postId,
      comment: args.comment,
    });
    return comment
      .save()
      .then((result) => {
        console.log(result);
        return { ...result._doc };
      })
      .catch((err) => {
        console.log("Adding comment error");
        throw err;
      });
  },
};

const updateComment = {
  type: CommentType,
  description: "update a comment, only the author can update it",
  args: {
    id: { type: GraphQLString },
    comment: { type: GraphQLString },
  },
  async resolve(parent, args, { verifiedUser }) {
    if (!verifiedUser) {
      throw new Error("Unauthenticated");
    }

    const commentUpdated = await Comment.findOneAndUpdate(
      {
        _id: args.id,
        userId: verifiedUser._id,
      },
      {
        comment: args.comment,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!commentUpdated) {
      throw new Error("No comment with the give ID found for the author");
    }

    return commentUpdated;
  },
};

const deleteComment = {
  type: GraphQLString,
  description: "delete comment",
  args: {
    id: { type: GraphQLString },
  },
  async resolve(parent, args, { verifiedUser }) {
    if (!verifiedUser) {
      throw new Error("Unauthenticated");
    }

    const commentDeleted = await Comment.findOneAndDelete({
      _id: args.id,
      userId: verifiedUser._id,
    });

    if (!commentDeleted) {
      throw new Error("No post with the give ID found for the author");
    }

    return "Comment deleted";
  },
};

module.exports = {
  userLogin,
  addPost,
  addComment,
  updatePost,
  deletePost,
  updateComment,
  deleteComment,
};
