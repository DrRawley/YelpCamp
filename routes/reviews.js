//Express
const express = require('express');
const router = express.Router({ mergeParams: true });

//Mongoose
const mongoose = require('mongoose');
const Campground = require('../models/campground'); //Include models
const Review = require('../models/review');

//Error handing requires
const catchAsync = require('../utils/catchAsync.js');

//Middleware includes
const { validateReview, isLoggedIn } = require('../middleware.js');

// ********* REVIEW ROUTES **************
//Route to submit new review
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res, next) => {
    let { id } = req.params; //Have to merge params in router definition for this to work
    let campground = await Campground.findById(id);
    let review = new Review(req.body.review);
    review.author = req.user._id; //Add author
    campground.reviews.push(review); //Push review onto campground reviews array
    await review.save();
    await campground.save();
    req.flash('success', 'Review successfully added!');
    res.redirect(`/campgrounds/${campground._id}`);
}));
//DELETE route to delete a review
router.delete('/:reviewId', isLoggedIn, catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    console.log(req.params);
    //Use $pull command to pull matching review out of the review array in campground
    let campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }, { new: true });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review successfully deleted!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

module.exports = router;