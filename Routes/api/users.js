const { check, validationResult } = require('express-validator');
const User = require('../../models/user');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const config = require('config');
// Defining Route Post request for registering the User
router.post('/',[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'email is required').isEmail(),
    check('password', 'Password is required').isLength({min: 6})
] , async (req, res) => {
    let error =  validationResult(req);
    if(!error.isEmpty()){
     return res.status(400).json({error: error.array()});
    }
//    if the validation is true then we will grab body parts
   const {name, email, password} = req.body;
//    Now let's see if the user exists by email
   try {
       let user = await User.findOne({ email });
       if(user) {
           return res.status(401).json({error: [ {err: "User Already Exists"} ]});
       }
       // if user Not exists Then we have to create the instance of the User object but before we have to embed the gravatar
     const avatar = gravatar.url( email, { 
         s: '200',
         r: 'pg',
         d: 'mm'
     });
     // Now we can create the instance of the user 
       user = new User({
           name,
           email,
           password,
           avatar
       });
       // before inserting into database we have to hash the password by using bcrypt
       const salt = await bcrypt.genSalt(10);
       user.password = await bcrypt.hash(password, salt);
       // Now just run the command like user.save() and that's it user will be saved in database
      
       await user.save();

       // jwt implementation

       const payload = {
           user: {
               id: user.id
           }
       };
       jwt.sign(payload, 
        config.get('SecretToken'),
        {expiresIn: 360000},
        (err, token) => {
            if(err) throw err
            res.json({token});
        });
   } catch (error) {
    console.error(error.message);
    res.send('Server Error');   
   }
});
module.exports = router;

// const User = require('../../models/user');
// const {check, validationResult} = require('express-validator');
// const gravatar = require('gravatar');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const config = require('config');
// const express = require('express');
// const router = express.Router();

// router.post('/', [
//     check('name', "Please Enter Your Name ").not().isEmpty(),
//     check('email','Please Enter Your email').isEmail(),
//     check('password', "please Enter Your Password").isLength( {min: 6})
// ], async (req, res) => {
//      let error = validationResult(req);
//      if(!error.isEmpty()) {
//          return res.status(400).json({ error: error.array()} );
//      }
//      // see if user exists
//      const { name, email, password} = req.body;
//      try {
//      let user = await User.findOne( {email} );
//      if(user) {
//          return res.status(400).json( {error :[ { msg: "User already Exists"} ] } );
//      }
//      // bringing the gravatar in the game 
//      let avatar = gravatar.url(email, {
//          s: '200',
//          r: 'pg',
//          d: 'mm'
//      });
//      // creating the instance of a user 
//      user = new User( {
//          name,
//          email,
//          password,
//          avatar
//      });
//      // hashing the password 
//       const salt = await bcrypt.genSalt(10);
//       user.password = await bcrypt.hash(password, salt);
//       await user.save();

//     // const payload = {
//     //     user: {
//     //         id: user.id
//     //     }
//     // }
//     // jwt.sign(payload,
//     //  config.get('SecretToken'),
//     //  {expiresIn: 360000},
//     //  (error, token) => {
//     //      if(error) throw error
//     //      res.json({token});
//     //  } 
//     // )

// } catch(err) {
//     console.error(err.message);
//     res.send('Server Error');
//  }
// });

// module.exports = router;

// Decscription Register User
// router.post('/',
// [
    
//     check('name' , 'Please Enter Name').not().isEmpty(),
//     check('email', 'Please Enter Email').isEmail(),
//     check('password').isLength( {min: 6} )

// ], async (req, res) => {
//     const error = validationResult(req);
//     if(!error.isEmpty()) {
//        return res.status(400).json( { error: error.array() });
//     }
//     // grabbing name and email from the req.body
//     const { name, email, password } = req.body;

//     try {
//     let user =await User.findOne( {email: email} );
//     if(user) {
//         return res.status(400).json({ error: [{msg: "User aleady exists"}] })
//     }
//     const avatar = gravatar.url(email, {
//         s: '200',
//         r: 'pg',
//         d: 'mm'
//     });
//     // creating the new user
//     user = new User({
//         name,
//         password,
//         email,
//         avatar
//     });
//     // encrypting the password

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);
//     await user.save();
//     res.send('User has been Registered')
//     } catch(err) {
//         console.error(err.message);
//     res.status(500).send(" server error ");
// }}
// );