const router = require('express').Router();
const auth = require('../../middleware/auth');
const User = require('../../models/user');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
// Defining Route Post request for Authentication
// Applying the middleware between route and callback function
router.get('/',auth , async (req, res) => {
    try {
        // Now i want to show find the user by it's id and as we know id is in User-id is in TOKEN we set it so 
        // it becomes easy to find a user by it's id 
        const user = await User.findById(req.user.id).select('-password');
        res.send(user);
    } catch (error) {
        res.status(500).send("Server Error");
    }
});
// Now Login Logic will go here
router.post('/',[
    check('email', 'email is required').isEmail(),
    check('password', 'Password is required').exists()
] , async (req, res) => {
    let error =  validationResult(req);

    if(!error.isEmpty()){
     return res.status(400).json({error: error.array()});
    }
//    if the validation is true then we will grab body parts
   const {email, password} = req.body;
// Now let's see if the user exists by email
    try {
       let user = await User.findOne({ email });
       if(!user) {
           return res.status(401).json({error: [ {err: "Invalid Crediantials"} ]});
       }
       // Now we will Compare The plain password got from request to the encrypted password saved in database
       const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch) {
        return res.status(401).json({error: [ {err: "Invalid Crediantials"} ]});
      }
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




// const express = require('express');
// const router = express.Router();
// const auth = require('../../middleware/auth');
// const User = require('../../models/user');
// const jwt = require('jsonwebtoken');
// const config = require('config');
// const bcrypt = require('bcryptjs');
// const {check, validationResult} = require('express-validator');

// // applying the auth below 

// router.get('/', auth , async (req, res) => {
//    try {
//        const user = await User.findById(req.user.id).select('-password');
//        res.send(user);
//    } catch (error) {
//        console.error(error.message);
//        res.status(500).send("Server Error");
//    }
// });
// // Login Authentication

// router.post('/', [
//     check('email','Please Enter Your email').isEmail(),
//     check('password', "password is require").exists()
// ], async (req, res) => {
//      let error = validationResult(req);
//      if(!error.isEmpty()) {
//          return res.status(400).json({ error: error.array()} );
//      }
//      // see if user exists
//      const {email, password} = req.body;
//      try {
//      let user = await User.findOne( {email} );
//      if(!user) {
//         return res.status(400).json( {error :[ { msg: "Invalid Credentials"} ] } );
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if(!isMatch) {
//         return res.status(400).json( {error :[ { msg: "Invalid Credentials"} ] } );
//     }
//     const payload = {
//         user: {
//             id: user.id
//         }
//     }
//     jwt.sign(payload,
//      config.get('SecretToken'),
//      {expiresIn: 360000},
//      (error, token) => {
//          if(error) throw error
//          res.json({token});
//      } 
//     )
// } catch(err) {
//     console.error(err.message);
//     res.send('Server Error');
//  }
// });
// module.exports = router;