const { Post, Comment, User } = require("../../database-model");
const DataLoader = require("dataloader");

const postLoader = new DataLoader((postIds) => {
  return events(eventIds);
});

const user = (userId) => {
  return User.findById(userId).catch((err) => {
    throw err;
  });
};

const posts = (postsIds) => {
  return Post.find({ id: { $in: postsIds } }).then(posts => {
      return posts.map(post => {
          return post
      })
  }).catch((err) => {
    throw err;
  });
};
