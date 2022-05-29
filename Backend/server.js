const express = require('express');
require('dotenv').config();

const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
    console.log(`URL: http://localhost:${port}`);
})

