const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/schema");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const { authenticate } = require("./middleware/auth");

app.use(authenticate);
app.use(bodyParser.json());

app.get("/", (req, res) => {
  console.log(req.verifiedUser);
});



app.get("/login/github", (req, res) => {
  const redirect_uri = "http://localhost:4000/login/github/callback";
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${redirect_uri}`;
  res.redirect(url);
});

app.get("/login/github/callback", async (req, res) => {
  const access_code = req.query.code;
  console.log(access_code);
  
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


