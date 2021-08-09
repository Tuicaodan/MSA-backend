const express = require('express');
const bodyParser = require('body-parser');
const graphQlHttp=require('express-graphql');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(bodyParser.json());


app.get('/', (req,res,next) =>{
    
})






app.listen(process.env.PORT, () => {
    console.log(`App running on PORT ${process.env.PORT}`);
});