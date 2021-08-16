const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/schema");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const app = express();
const { authenticate } = require("./middleware/auth");


//allow cross-origin requests
app.use(cors())

app.use(authenticate);
app.use(bodyParser.json());

// app.get("/", (req, res) => {
//   console.log(req.verifiedUser);
// });


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
