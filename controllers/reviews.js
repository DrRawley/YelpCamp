//Express
const express = require('express');
//Mongoose
const mongoose = require('mongoose');
const Campground = require('../models/campground'); //Include models
const Review = require('../models/review');

module.exports.create = async (req, res, next) => {
    let { id } = req.params; //Have to merge params in router definition for this to work
    let campground = await Campground.findById(id);
    let review = new Review(req.body.review);
    review.author = req.user._id; //Add author
    campground.reviews.push(review); //Push review onto campground reviews array
    await review.save();
    await campground.save();
    req.flash('success', 'Review successfully added!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.delete = async (req, res, next) => {
    const { id, reviewId } = req.params;
    //Use $pull command to pull matching review out of the review array in campground
    let campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }, { new: true });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review successfully deleted!');
    res.redirect(`/campgrounds/${campground._id}`);
}