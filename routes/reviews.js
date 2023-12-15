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
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');

//Controller include
const reviews = require('../controllers/reviews.js');

// ********* REVIEW ROUTES **************
//Route to submit new review
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.create));

//DELETE route to delete a review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.delete));

module.exports = router;