const express = require('express');
const router = express.Router();
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



module.exports = router;