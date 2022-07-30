const User = require("../Schema/User");
const verifyUser = async (req,res)=>{
    const vuser  = await User.findOne({email:req.body.email});
    if(vuser){
        next();
  
    }
    else{
        console.log('user not verified!');
        res.redirect('/signup');
    }
  }
  module.exports = verifyUser
  