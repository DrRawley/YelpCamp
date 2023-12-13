//Express
const express = require('express');
const router = express.Router({ mergeParams: true });

//Mongoose
const mongoose = require('mongoose');
const Campground = require('../models/campground'); //Include models
const Review = require('../models/review');

//Error handing requires
const ExpressError = require('../utils/ExpressError.js');
const catchAsync = require('../utils/catchAsync.js');

//********* JOI Schema Validations **********************************/
const Joi = require('joi');
const { reviewSchema } = require('../schemas.js');
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// ********* REVIEW ROUTES **************
//Route to submit new review
router.post('/', validateReview, catchAsync(async (req, res, next) => {
    let { id } = req.params; //Have to merge params in router definition for this to work
    let campground = await Campground.findById(id);
    let review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();

    res.redirect(`/campgrounds/${campground._id}`);
}));
//DELETE route to delete a review
router.delete('/:reviewId', catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    console.log(req.params);
    //Use $pull command to pull matching review out of the review array in campground
    let campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }, { new: true });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/campgrounds/${campground._id}`);
}))

module.exports = router;