//Mongoose
const mongoose = require('mongoose');
const Campground = require('./models/campground'); //Include models
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;  //tracks url unlogged user was trying to access
        req.flash('error', 'You must be logged in to do that.');
        return res.redirect('/login');
    }
    next();
}

//stores the returnTo url in locals because the new passport clears the session
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

//Campground ownership check Middleware
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Campground not found. Edit unsuccessful.');
        return res.redirect('/campgrounds');
    };
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'Not the campground\'s author.');
        return res.redirect('/campgrounds');
    }
    next();
}
//Review ownership check Middleware
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId)
    if (!review) {
        req.flash('error', 'Review not found.');
        return res.redirect(`/campgrounds/${id}`);
    };
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'Not the reviews\'s author.');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

//********* JOI Schema Validations **********************************/
const Joi = require('joi');
const { campgroundSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError.js');
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body); //validate form data with schema
    //                                                      deconstruct results
    if (error) {   //if there's an error log it
        const msg = error.details.map(el => el.message).join(', ') //account for multiple errors
        console.log(id);
        throw new ExpressError(msg, 400);  //throw the errors so the error handler can report
        //we only see this if we make it past the client side validation.
    } else {
        next();
    }
}
const { reviewSchema } = require('./schemas.js');
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}