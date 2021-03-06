const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/schema");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const app = express();
const { authenticate } = require("./middleware/auth");
const {
  commentsDataLoader,
  usersDataLoader,
  postsDataLoader,
} = require("./graphql/dataloader");

//allow cross-origin requests
app.use(cors());

app.use(authenticate);
app.use(bodyParser.json());

// app.get("/", (req, res) => {
//   console.log(req.verifiedUser);
// });

app.use(
  "/graphql",
  graphqlHTTP((req) => ({
    schema: schema,
    graphiql: true,
    context: {
      loaders: {
        commentsDataLoader: commentsDataLoader(),
        usersDataLoader: usersDataLoader(),
        postsDataLoader: postsDataLoader(),
      },
      verifiedUser: req.verifiedUser,
    },
  }))
);

//connect database with mongoose
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) =>
    app.listen(process.env.PORT, () => {
      console.log(`app listening on port ${process.env.PORT}!`);
    })
  )
  .catch((err) => console.log(err));
