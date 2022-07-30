const express = require('express');
const connectToMongo = require('./db');
const app = express();
const port = '5000';
const userRoutes = require('./Routes/User');
const User = require('./Schema/User');
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const cors = require('cors');
require("dotenv").config();
const verifyUser = require('./Middleware/verifyUser');
app.use(cors())
connectToMongo();
app.listen(port,(console.log(`Connected to node server at port ${port}!`)));
app.get('/',(req,res)=>{
    res.send('1-2-3-4-6-9, representing the ABQ wassup biatch!')
})
app.get('/home',verifyUser,(req,res)=>{
    res.send('1-2-3-4-6-9, representing the ABQ wassup biatch!')
})
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/user',userRoutes);