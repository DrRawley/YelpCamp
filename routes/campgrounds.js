//Express
const express = require('express');
const router = express.Router();

//Mongoose
const mongoose = require('mongoose');
const Campground = require('../models/campground'); //Include models
const Review = require('../models/review');

//Error handing requires
const ExpressError = require('../utils/ExpressError.js');
const catchAsync = require('../utils/catchAsync.js');

//********* JOI Schema Validations **********************************/
const Joi = require('joi');
const { campgroundSchema } = require('../schemas.js');
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body); //validate form data with schema
    //                                                      deconstruct results
    if (error) {   //if there's an error log it
        const msg = error.details.map(el => el.message).join(', ') //account for multiple errors
        throw new ExpressError(msg, 400);  //throw the errors so the error handler can report
        //we only see this if we make it past the client side validation.
    } else {
        next();
    }
}

// ********* CAMPGROUND ROUTES **************

//Route for campground index
router.get('/', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));
//Route to get form for a new campground (come before :id or crash)
router.get('/new/', (req, res) => {
    res.render('campgrounds/new');
});
//POST route to submit new campground
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`campgrounds/${newCampground._id}`);
}));
//Show route for single campground details
router.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/show', { campground });
}));
//Get edit form route
router.get('/:id/edit', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
}));
//PUT route to submit edited campground
router.put('/:id', validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    console.log(req.body.campground); // in html in name="blah[bloh]" --> req.body.blah.bloh
    await Campground.findByIdAndUpdate(id, req.body.campground).then(r => {
        res.redirect(`/campgrounds/${r._id}`);
    });
}));
//DELETE route
router.delete('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;

    let r = await Campground.findByIdAndDelete(id);
    console.log('BALEETED!');
    res.redirect('/campgrounds/');
}))

module.exports = router;
