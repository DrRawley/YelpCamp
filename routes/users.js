const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const { storeReturnTo } = require('../middleware');

router.get('/register', (req, res) => {
    res.render('users/register');
});
router.post('/register', catchAsync(async (req, res) => {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    try {
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }
            //this stuff needs to be in here since async
            req.flash('success', 'Welcome to YelpCamp!');
            res.redirect('/campgrounds');
        });
    } catch (e) {
        console.log(e.message);
        req.flash('error', `E-mail already exists!`);
        return res.redirect('/register');
    }



}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login',
    // use the storeReturnTo in middleware.js to save the returnTo value from session to res.locals    
    storeReturnTo,
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    catchAsync(async (req, res) => {
        req.flash('success', 'Welcome back!');
        const redirectUrl = res.locals.returnTo || '/campgrounds'; //use res.locals instead of req.session
        res.redirect(redirectUrl);
    }));

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {  //logout now requires a callback function to handle errors
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye.');
        res.redirect('/campgrounds');
    });
})

module.exports = router;