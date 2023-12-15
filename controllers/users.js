//Express
const express = require('express');
//Passport
const passport = require('passport');
//Model
const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.create = async (req, res) => {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    try {
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }
            //this stuff needs to be in here since async await
            req.flash('success', 'Welcome to YelpCamp!');
            res.redirect('/campgrounds');
        });
    } catch (e) {
        console.log(e.message);
        req.flash('error', `E-mail already exists!`);
        return res.redirect('/register');
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds'; //use res.locals instead of req.session
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {  //logout now requires a callback function to handle errors
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye.');
        res.redirect('/campgrounds');
    });
}
