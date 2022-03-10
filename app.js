// Import all dependencies
const dotenv = require('dotenv');
const express = require('express');
const bcrpytjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();

app.get('/', (req, res)=>{
    res.send("Hello World!");
})


// Run Server
let port = 3001;
app.listen(port, ()=>{
    console.log("Server is listening at port:", port);
}) 