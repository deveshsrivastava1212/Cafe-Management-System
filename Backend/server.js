const express = require('express');
var cors = require('cors')
require('dotenv').config();

const connection = require('./db/connection');
const userRoute = require('./routes/user')
const categoryRoute = require('./routes/category')
const productRoute = require('./routes/product')
const billRoute = require('./routes/bill')
const dashboardRoute = require("./routes/dashboard")

const port = process.env.PORT;
const app = express();

app.use(cors({
    origin: 'https://localhost:5005'
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/user', userRoute);
app.use('/category',categoryRoute);
app.use('/product',productRoute);
app.use('/bill',billRoute);
app.use('/dashboard',dashboardRoute);

app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
    console.log(`URL: http://localhost:${port}`);
})

