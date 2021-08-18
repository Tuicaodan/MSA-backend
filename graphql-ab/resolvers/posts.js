const { Post, Comment, User } = require("../../database-model");

module.exports = {
  post: async (args) => {
    try {
      const post = await Post.findById(args.id);
      return post;
    } catch (err) {
      throw err;
    }
  },
  posts: async () => {
    try {
      const posts = await Post.find().sort({ createdAt: -1 });
      console.log(posts)
      return posts
    } catch (err) {
      throw err;
    }
  },
  addPost: async (args, req) => {
    //console.log("Verified User: ", verifiedUser);
    if (!req.verifiedUser) {
      throw new Error("Unauthenticated");
    }
    const post = new Post({
      authorId: req.verifiedUser._id,
      title: args.title,
      youtube_url: args.youtube_url,
      description: args.description,
    });
    try {
      const result = await post.save();
      //console.log(result);
      return result;
    } catch (err) {
      console.log("Adding post error in server: " + err);
      throw new Error(err);
    }
  },
};
