const mysql = require('mysql')
require('dotenv').config();

var connection = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.USER,
    password : process.env.PASSWORD,
    database: process.env.database
})

connection.connect((err) =>{
    if(err){
        console.log(err);
    }
    else{
        console.log("Database connected");
    }
})

module.exports = connection;
