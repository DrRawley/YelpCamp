//Express
const express = require('express');
//Mongoose
const mongoose = require('mongoose');
const Campground = require('../models/campground'); //Include models
const Review = require('../models/review');

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.create = async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    newCampground.images = req.files.map(f => ({ url: f.path, filename: f.filename })); //map out an object for every array element
    newCampground.author = req.user._id;
    await newCampground.save();
    console.log(newCampground);
    req.flash('success', 'Successfully made a new campground.');
    res.redirect(`campgrounds/${newCampground._id}`);
}

module.exports.show = async (req, res, next) => {
    const { id } = req.params;
    //This populates the author in campground, but not also in reviews 
    //const campground = await Campground.findById(id).populate('reviews').populate('author');
    const campground = await Campground.findById(id)
        .populate({  //have to nest an object here to populate what's inside of it.
            path: 'reviews',   //populate reviews
            populate: {  //this must be a nested object too
                path: 'author'  //populate author of each review
            }
        })
        .populate('author'); //populate the campground author
    if (!campground) {
        req.flash('error', 'Campground not found.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Campground not found.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.update = async (req, res, next) => {
    const { id } = req.params;
    let campground = await Campground.findByIdAndUpdate(id, req.body.campground)
    req.flash('success', 'Edit submitted successfully.');
    return res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.delete = async (req, res, next) => {
    const { id } = req.params;
    let r = await Campground.findByIdAndDelete(id);
    req.flash('success', `Successfully deleted ${r.title}.`);
    res.redirect('/campgrounds/');
}