const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground'); //Include model

mongoose.connect('mongodb://localhost:27017/yelp-camp');
// The following mongoose options are no longer needed
// { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }

const db = mongoose.connection; //db is just a shortcut to avoid typing mongoose.connection all the time
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected.");
});

app.set('view engine', 'ejs'); //set default view engine to ejs
app.set('views', path.join(__dirname, 'views'));

app.listen(3000, () => {
    console.log("Listening on port 3000...");
});

//Basic route for initial testing
app.get('/', (req, res) => {
    res.render('home');
});

//Route for camapground index
app.get('/campgrounds/', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
});
//Route to get form for a new campground (come before :id or crash)
app.get('/campgrounds/new/', (req, res) => {
    res.render('campgrounds/new');
});
//Show route for single camapground details
app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', { campground });
});



//Test the db by making a new campground
// app.get('/makecampground', async (req, res) => {
//     const camp = new Campground({
//         title: 'My Backyard',
//         price: '0',
//         description: 'cheap camping',
//         location: 'nowhere in particular'
//     })
//     await camp.save().then(r => {
//         console.log(r);
//         res.redirect('/');
//     })
// })
