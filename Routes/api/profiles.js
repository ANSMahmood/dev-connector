// testing the branch
const express = require('express');
const router = express.Router();
const config = require('config');
const request = require('request');
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');
const Profile = require('../../models/profile');
const User = require('../../models/user');
const Post = require('../../models/post');

//@ route GET api/profile/me // end point geting the id from the token that's why we bring auth middleware 
//@ desc Get current Users Profile
//@ access private

// async await because we are using mongoose here
router.get('/me', auth, async (req, res) => {
    try {     // we are searching by user as we know we have already ref in schema req.user.id it comes in a token
        const profile = await Profile.findOne( {user: req.user.id} ).populate('user', ['name', 'avatar']);
        if(!profile) {
            return res.status(400).json({ msg: "There is no profile for this user"});
        }
        res.json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@ route POST api/profile 
//@ desc create or update user profile
//@ access private

router.post('/', [auth, 
   check('status', 'Status is required').not().isEmpty(),
   check('skills', 'Skills is required').not().isEmpty()
], async (req, res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json( {error: error.array() } );
    }
  // pulling out all the fields from req.body object

  const {
        company,
        website,
        location, 
        bio, 
        status, 
        githubusername, 
        skills, 
        youtube, 
        facebook, 
        twitter, 
        instagram, 
        linkedin
  } = req.body;

  // Now we are gonna check bio or vice versa fields are added before saving in them in the database
  // For that Build A Profile Object
   const profileFields = {};     // declaring and initializing an object
   profileFields.user = req.user.id;   // tell that object to whom gonna assign id
   if(company) profileFields.company = company;  // left will be property of that object right is the value from body
   if(website) profileFields.website = website;
   if(location) profileFields.location = location;
   if(bio) profileFields.bio= bio;
   if(status) profileFields.status = status;
   if(githubusername) profileFields.githubusername =githubusername;
   if(skills) {
       profileFields.skills = skills.split(',').map(skill => skill.trim());
   }

   // Build social object
   profileFields.social = {};
   if(youtube) profileFields.social.youtube = youtube; // youtube is inside social that why we have to declare obj for it
   if(facebook) profileFields.social.facebook = facebook;
   if(twitter) profileFields.social.twitter= twitter;
   if(instagram) profileFields.social.instagram = instagram;
   if(linkedin) profileFields.social.linkedin = linkedin;

   try {
       let profile = await Profile.findOne( {user: req.user.id });
       if(profile) {
           // if Profile found than we just update it .... it should be simple 
           profile = await Profile.findOneAndUpdate( 
               {user: req.user.id},
               {$set: profileFields},
               { new: true}
               );
               return res.json(profile);
       }
       // And if not found then just simply create it 
       profile = new Profile(profileFields);
       // saving the user's profile
       await profile.save();

       res.json(profile);

   } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');   
   }
});

//@ route    Get api/profile 
//@ desc     Get all profiles
//@ access   Public

router.get('/', async (req, res) => {
    try {
        const profile = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//@ route    Get api/profile/user/:user_id 
//@ desc     Get profile by user ID
//@ access   Public
       
           // it is the method of getting parameters like /user/:user_id or / user ?user_id = kdsjassfsfkdf
router.get('/user/:user_id', async (req, res) => {
    try {   // user_id will be same as parameter :user_id IT WILL BE A PARAMETER ACCEPTING ARGUMENTS WHICH WILL BE ID
        const profile = await Profile.findOne( {user:req.params.user_id} ).populate('user', ['name', 'avatar']);
        if(!profile){
         return    res.status(400).json( {msg: "There is no profile for this user" });
        }
        res.json(profile)
    } catch (err) {
        if(err.kind == "ObjectId") {
        return res.status(400).json( {msg: "There is no profile for this user" });
        }
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//@ route    (DELETE)request    (api/profile)End Point 
//@ desc     DELETE profile users and posts
//@ access   Private

router.delete('/',auth ,  async (req, res) => {
    try {
        // Remove User Posts
        await Post.deleteMany({user: req.user.id});
        // Remove Profile
        await Profile.findOneAndRemove({user: req.user.id});
        // Remove user
        await User.findOneAndRemove({_id: req.user.id});
        res.json({msg: "User Deleted"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});



// Now we are going to add profile experience by PUT request and this request is used to update the specific part of the document

//@ route    (PUT)request    (api/profile/experience)End Point 
//@ desc     Add profile experience
//@ access   Private

router.put('/experience', [auth, 
check('title', 'Title is required').not().isEmpty(),
check('company', 'company is required').not().isEmpty(),
check('from', 'from is required').not().isEmpty(),
], async (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return res.status(400).json({error: error.array()});
    }
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
            };
            // we often use try catch whenever we're gonna deal with the dataBase
            try {
                const profile = await Profile.findOne( {user: req.user.id} );
                // last added will show first after using unshift inside experience array
                profile.experience.unshift(newExp);
                await profile.save();
                res.json(profile);
            } catch (err) {
                console.error(err.message);
                res.status(500).send("Server Error");
            }
});
             // :exp_id is the placeholder we'll see in front-end how it works
//@ route    (DELETE)request    (api/profile/experience/:exp_id)End Point 
//@ desc     Add profile experience
//@ access   Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {                                // remember req.user.id is in token
        const profile = await Profile.findOne({ user: req.user.id });

        // Get remove index number it is arrays indexOf() method and also chain together
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        // Now we have the index and we're simply going to splice that one from experience array
        profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//@ route    (PUT)request    (api/profile/education)End Point 
//@ desc     Add profile education
//@ access   Private

router.put('/education', [auth, 
    check('school', 'Title is required').not().isEmpty(),
    check('degree', 'degree is required').not().isEmpty(),
    check('fieldofstudy', 'field Of Study is required').not().isEmpty(),
    check('from', 'from Date is required').not().isEmpty(),
    ], async (req, res) => {
        const error = validationResult(req);
        if(!error.isEmpty()) {
            return res.status(400).json({error: error.array()});
        }
        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
            } = req.body;
    
            const newEdu = {
                school,
                degree,
                fieldofstudy,
                from,
                to,
                current,
                description
                };
                // we often use try catch whenever we're gonna deal with the dataBase
                try {
                    const profile = await Profile.findOne( {user: req.user.id} );
                    // last added will show first after using unshift inside experience array
                    profile.education.unshift(newEdu);
                    await profile.save();
                    res.json(profile);
                } catch (err) {
                    console.error(err.message);
                    res.status(500).send("Server Error");
                }
            });
       //@ route    (DELETE)request    (api/profile/education/:edu_id)End Point 
    //@ desc     Add profile education
    //@ access   Private
    
    router.delete('/education/:edu_id', auth, async (req, res) => {
        try {                                // remember req.user.id is in token
            const profile = await Profile.findOne({ user: req.user.id });
    
            // Get remove index number it is arrays indexOf() method and also chain together
            const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
    
            // Now we have the index and we're simply going to splice that one from experience array
            profile.education.splice(removeIndex, 1);
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //@ route    GET api/profile/github/:username 
    //@ desc     Get user repos from Github
    //@ access   public

    router.get('/github/:username', (req, res) => {
        try {
            const options = {
                uri: `https://api.github.com/users/${
                    req.params.username
                }/repos?per_page=5&sort=created:asc&client_id=${
                    config.get('githubClientId')
                }&client_secret=${
                    config.get('githubClientSecret')
                }`,
            method: 'GET',
            headers: {'user-agent': 'node.js'} 

        };
        request(options, (error, response, body) => {
            if(error) console.error(error.message);
            if(response.statusCode !== 200) {
                return res.status(404).json({msg: "No Github Profile Found"});
            }
            res.json(JSON.parse(body));
        });
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    });
module.exports = router;