const mysql = require('mysql');
require('dotenv').config();
var connection = mysql.createConnection({
    port : process.env.DB_PORT,
    host : process.env.DB_HOST,
    // host: 'localhost',
    // user: 'root',
    // password: '',
    // port: 3306,
    user : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database: process.env.DB_NAME  
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
