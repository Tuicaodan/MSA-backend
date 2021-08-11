const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/schema");
const dotenv = require("dotenv");
dotenv.config();
const fetch = require("node-fetch");

const app = express();

const { createJwtToken } = require("./util/jwt-auth");
const { authenticate } = require("./middleware/auth");

app.use(authenticate);
app.use(bodyParser.json());

app.get("/", (req, res) => {
  console.log(req.verifiedUser);
});

//github login route
app.get("/login/github", (req, res) => {
  const redirect_uri = "http://localhost:4000/login/github/callback";
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${redirect_uri}`;
  res.redirect(url);
});

app.get("/login/github/callback", async (req, res) => {
  const access_code = req.query.code;
  const access_token = await getAccessToken(
    access_code,
    process.env.GITHUB_CLIENT_ID,
    process.env.GITHUB_CLIENT_SECRET
  );
  const githubUserdata = await getGithubUser(access_token);
  console.log(githubUserdata);
  res.json(githubUserdata);
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

async function getAccessToken(access_code, client_id, client_secret) {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: access_code,
      client_id: client_id,
      client_secret: client_secret,
    }),
  });
  const data = await response.text();
  const params = new URLSearchParams(data);
  return params.get("access_token");
}

async function getGithubUser(access_token) {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `bearer ${access_token}`,
    },
  });
  const data = await response.json();
  return data;
}
