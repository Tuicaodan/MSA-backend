const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/schema");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

const { createJwtToken } = require("./util/auth");
const { authenticate } = require("./middleware/auth");

app.use(authenticate);
app.use(bodyParser.json());

app.get("/", (req, res) => {
  console.log(req.verifiedUser);
});

//test route for the jwt
app.get("/authtest", (req, res) => {
  res.json(
    createJwtToken({
      username: "test1",
      access_token: "123455",
      avatar_url: "http:goodle.com",
    })
  );
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
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
