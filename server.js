const express = require("express");
const bodyParser = require("body-parser");
const graphQlHttp = require("express-graphql");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res, next) => {});

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
