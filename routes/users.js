const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

router.get('/register', (req, res) => {
    res.render('users/register');
});
router.post('/register', catchAsync(async (req, res) => {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    try {
        const registeredUser = await User.register(user, password);
    } catch (e) {
        console.log(e.message);
        req.flash('error', `E-mail already exists!`);
        return res.redirect('/register');
    }

    console.log(registeredUser);
    req.flash('success', 'Welcome to YelpCamp!');
    res.redirect('/campgrounds');
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login',
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    catchAsync(async (req, res) => {
        req.flash('success', 'Welcome back!');
        res.redirect('/campgrounds');

    }));

module.exports = router;