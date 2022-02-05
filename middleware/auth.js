 const User = require('../models/user');
 const config = require('config');
 const jwt = require('jsonwebtoken');
 // Token verification middleware Function 
 module.exports = (req, res, next) => {
     const token = req.header('x-auth-token');
     // check if token exists
    //  process.env.
     if(!token) {
         return res.status(401).json( {msg: "Access denied !"} );
     }
     // if exits then verify and as we know we will verify it with database so we will use try catch
     try {
         const decoded = jwt.verify(token, config.get('SecretToken'));
         // if it verifies then 
         req.user = decoded.user;
         next();
     } catch (error) {
         res.status(401).json({msg:"Token is Invalid"});
     }
 }



// const jwt = require('jsonwebtoken');
// const config = require('config');



// // verify the token

// module.exports = (req, res, next) => {
//     // if the token exists in the header 
//     const token = req.header('x-auth-token');

//     // check if token not exists
//     if(!token) {
//         return res.status(401).json({msg: "Accesss-denied"});
//     }
//     // verify token 
//     try {
//         let decoded = jwt.verify(token, config.get('SecretToken'));
//         req.user = decoded.user;

//         next();

//     } catch(err) {
//         res.status(404).json({msg: "Access-denied"});
//     }
// }