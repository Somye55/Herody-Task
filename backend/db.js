const mongoose = require('mongoose');
const User = require('./Schema/User');
require('dotenv').config();
const URI = process.env.MONGO_URI


const connectToMongo=async ()=>{
    try {
        await mongoose.connect(URI);
        console.log(`connected to mongo at ${URI}!`)
      } catch (error) {
       console.log("some error:",error);
      }}
// const test = new User({
//   first:'ash',
//   last:'gay',
//   email:'gdf@gmail.com',
//   password:'nhi',
//   state:'io',
//   gender:'male'
// })

module.exports = connectToMongo;