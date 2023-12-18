//Express
const express = require('express');
const router = express.Router();
const multer = require('multer'); //Multer handles the multipart form, ie file uploading
const { storage } = require('../cloudinary/index.js'); //node will look for index.js automatically tho
const upload = multer({ storage });

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
router.route('/')
    .get(catchAsync(campgrounds.index)) //Route for campground index
    // .post(isLoggedIn, validateCampground, catchAsync(campgrounds.create)); //POST route to submit **NEW** campground
    .post(upload.array('imageFile', 4), (req, res) => {
        console.log(req.body, req.files);
        res.send('Submitted.');
    })
//Route to get form for a new campground (come before :id or crash)
router.get('/new/', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.show)) //Show route for single campground details
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.update)) //PUT route to submit edited campground
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.delete)); //DELETE route

//Get edit form route
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;
