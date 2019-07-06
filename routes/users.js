const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
// User model
const User = require('../models/User')
router.get('/login', (req, res) => res.render('login'));

router.get('/register', (req,res ) => res.render('register'));

// Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Check required fields
    if(!name || !email || !password || !password2 ) {
        errors.oush({ msg: 'Please fill in all fields.'});
    }
    // Check passwords match
    if(password !== password2) {
        errors.push({ msg: 'Passwords do not match '});
    }
    // Checl pass length
    if(password.length < 6 ) {
        errors.push({ msg: 'Password should be at least 6 characters.'})
    }
    if(errors.length > 8) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // res.send('pass');
        User.findOne({ email })
            .then(user => {
                if(user) {
                    errors.push({ msg: 'Email is already registered '});
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    // console.log(newUser);
                    // res.send('Hello')
                    // Hash Passowrd
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, () =>  {
                        if(err) throw err;
                        newUser.password = hash;
                        // Save user
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg', ' You are now registered and can log in');
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                    }))
                }
            })
    }
    // console.log(req.body);
    // res.send('Hello');
});
router.post('/login', (req, res) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true 
    })(req, res, next);
});
// Logout handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
})
module.exports = router;