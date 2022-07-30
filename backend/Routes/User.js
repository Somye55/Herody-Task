const express = require("express");
const router = express.Router();
const User = require("../Schema/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'stanleyishavinganaffair';
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { ResultWithContext } = require("express-validator/src/chain");
require("dotenv").config();
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);





router.post(
  "/signup",
  body("first").isString(),
  body("last").isString(),
  body("password").isLength({ min: 8 }),
  body("email").isEmail(),
  async (req, res) => {
    const { first, last, email, password, cpassword,dob,phoneNumber,state, } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await User.findOne({ email: email });
    if (user) {
      res.status(400).json({ code: 'email' });
    } else if (password !== cpassword) {
      res.status(400).json({ code: password });
    } else {
      try {
        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash(password, salt);
        const nuser = await User.create({
          first: first,
          last: last,
          password: pass,
          email: email,
          phoneNumber:phoneNumber,
          dob:dob,
          state:state,
          emailToken: crypto.randomBytes(64).toString('hex'),
          isVerified:false
        });
        try {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
              user: process.env.USER,
              pass: process.env.PASS,
            },
          });

          await transporter.sendMail({
            from: process.env.USER,
            to: nuser.email,
            subject: 'Xyz- Please verify your email',
            html: `<p > Hello <b> ${nuser.first.toUpperCase()+' '+nuser.last.toUpperCase()} </b>, welcome to Origin Cloud Technologies! <p> </br> <h3>Please verify your email here:<a href='http://${req.headers.host}/user/verify-email?token=${nuser.emailToken}'> Verify your email </a> </h3>`,
          });
          console.log("email sent sucessfully");
          res.json({email:true})
        } catch (error) {
          console.log("email not sent");
          console.log(error);
          res.json({email:false})

        }
       
      } catch (error) {
        res.status(408).json({ code: 'server' });
      }
    }
  }
);

router.post(
  "/login",
  body("email").isEmail(),
  body("password").exists(),
  async (req, res) => {
    const { email, password } = req.body;
    const vuser = await User.findOne({ email: email });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors)
      return res.json('Please enter valid credentials!')
    }
    if (!vuser) {
      res.json("Email not found!")

    }

    else {
      try {
        const check = await bcrypt.compare(password, vuser.password);
        if (!check) {
          res.json("wrong password")
        }
        else {
          const data = {
            user: {
              id: vuser.id
            }
          }
          const authtoken = jwt.sign(data, JWT_SECRET);
          res.json({ success: true, authtoken });
          
        }
      }
      catch (error) {
        res.json('some error')

      }


    }
  }
  )
  
//   router.post('/verify',
//     body("first").isString(),
//     body("last").isString(),
//     body("password").isLength({ min: 8 }),
//     body("email").isEmail(),
//     async (req, res) => {
//       const { first, last, email, password, cpassword } = req.body;
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }
//      const emailToken = crypto.randomBytes(64).toString('hex');
//      const isVerified = false;
//      const nuser = User.create({
//       emailToken:emailToken,
//       isVerified:false
//      })
//      try {
//       const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         port: 587,
//         secure: false,
//         auth: {
//           user: process.env.USER,
//           pass: process.env.PASS,
//         },
//       });

//       await transporter.sendMail({
//         from: process.env.USER,
//         to: email,
//         subject: 'Xyz- Please verify your email',
//         html: `<p> Hello <b> ${first.toUpperCase()+' '+last.toUpperCase()} </b>, welcome to Origin Cloud Technologies! <p> </br> <h3>Please verify your email here:<a href='http://${req.headers.host}/user/verify-email?token=${emailToken}'> Verify your email </a> </h3>`,
//       });
//       console.log("email sent sucessfully");
//       res.status(200).json({email:true})
//     } catch (error) {
//       console.log("email not sent");
//       console.log(error);
//       res.status(400).json({email:false})

//     }  

// })

router.get('/verify-email',async (req,res)=>{
  try {
    const token = req.query.token;
    const fuser = await User.findOne({emailToken:token});
    if(fuser){
      fuser.emailToken = null;
      fuser.isVerified = true;
      const data = {
        user: {
          id: fuser.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      await fuser.save();
      res.redirect('http://localhost:3000/verify-email')
      console.log("Email verified successfully!");

    }
    else{
      console.log('email is not verified')
      res.json({verify:false})
      res.redirect('http://localhost:3000/signup')

    }
    
  } catch (error) {
    console.log(error)
  }
})

router.post('/send-verification', async (req, res) => {
  client.verify.services(process.env.VERIFY_SERVICE_SID)
    .verifications
    .create({to: `+${req.body.phoneNumber}`, channel: 'sms'})
    .then(verification => console.log(verification.status))
    .catch(e => {
      console.log(e)
      res.status(500).send(e);
    });

  res.status(200).json('success');
});
router.post('/verify-otp', async (req, res) => {
  const check = await client.verify.services(process.env.VERIFY_SERVICE_SID)
    .verificationChecks
    .create({to: `+${req.body.phoneNumber}`, code: req.body.otp})
    .catch(e => {
      console.log(e)
      res.status(500).send(e);
    });
    const token = req.headers.authtoken;
    const vuser = await User.findOneAndUpdate({authtoken:token},{isChecked:true});

  res.status(200).send(check);
});
router.get('/view_profile',async (req,res)=>{
  const token  = req.headers.authtoken;
  const vuser = await User.findOne({authtoken:token});
  if(vuser){
    res.json(vuser);

  }
  else{
    res.json('User not found')
  }

})


module.exports = router;
