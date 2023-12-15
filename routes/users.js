//Express
const express = require('express');
const router = express.Router();
//Passport
const passport = require('passport');
//Model
const User = require('../models/user');
//Error handing requires
const catchAsync = require('../utils/catchAsync');
//Middleware
const { storeReturnTo } = require('../middleware'); //save the returnTo value into res.locals

//Users controller
const users = require('../controllers/users');

router.get('/register', users.renderRegisterForm);

router.post('/register', catchAsync(users.create));

router.get('/login', users.renderLoginForm);

router.post('/login',
    storeReturnTo, // use the storeReturnTo in middleware.js to save the returnTo value from session to res.locals    
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    catchAsync(users.login));

router.get('/logout', users.logout)

module.exports = router;