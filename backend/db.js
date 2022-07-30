const mongoose = require('mongoose');
const User = require('./Schema/User')
const URI = 'mongodb+srv://username:pass1@assignment-1.ifyy1.mongodb.net/?retryWrites=true&w=majority'


const connectToMongo=async ()=>{
    try {
        await mongoose.connect('mongodb+srv://username:pass1@assignment-1.ifyy1.mongodb.net/?retryWrites=true&w=majority');
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