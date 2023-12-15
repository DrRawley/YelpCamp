//Express
const express = require('express');
const router = express.Router();

//Mongoose
const mongoose = require('mongoose');
const Campground = require('../models/campground'); //Include models
const Review = require('../models/review');

//Error handing requires
const catchAsync = require('../utils/catchAsync.js');

//Authetication middleware
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');

//Controller include
const campgrounds = require('../controllers/campgrounds.js');

// *********************** CAMPGROUND ROUTES *******************************
//Route for campground index
router.get('/', catchAsync(campgrounds.index));

//Route to get form for a new campground (come before :id or crash)
router.get('/new/', isLoggedIn, campgrounds.renderNewForm);

//POST route to submit **NEW** campground
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.create));

//Show route for single campground details
router.get('/:id', catchAsync(campgrounds.show));

//Get edit form route
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

//PUT route to submit edited campground
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.update));

//DELETE route
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.delete));

module.exports = router;
