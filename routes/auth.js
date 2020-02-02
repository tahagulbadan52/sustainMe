const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv/config');


const router = express.Router();

//Register route
router.post('/register', (req, res) => {
    User.findOne({email: req.body.email.toLowerCase()})
        .then(user => {
            if(user) {
                res.status(400).json({"message": "Email alerady exist"})
            } else {
                console.log('req', req.body.name);
                const newUser = new User({
                    email: req.body.email.toLowerCase(),
                    password: req.body.password
                });

                bcrypt.genSalt((err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });
            }
        })
});

/**
 * Post route for login.
 * 
 * @name POST: /auth/login/
 * 
 * @param {string} email - email of the user
 * @param {string} password - password of user
 */
router.post('/login', (req, res) => {
    User.findOne({email: req.body.email})
     .then(user=>{
         if(!user) {
             return res.status(400).json({"message": "Email doesn't exist"});
         } else {
             bcrypt.compare(req.body.password, user.password)
                 .then(isMatch => {
                     
                     if (isMatch) {

                        res.json(user);

                     } else {
                         return res.status(400).json({"message": "Password is invalid"})
                     }
                 })
         }
     })
 });

module.exports = router;