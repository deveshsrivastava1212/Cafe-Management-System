const express = require('express');
var cors = require('cors')
require('dotenv').config();
const connection = require('./db/connection');
const userRoute = require('./routes/user')

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/user', userRoute);

app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
    console.log(`URL: http://localhost:${port}`);
})

