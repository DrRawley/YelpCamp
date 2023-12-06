const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground'); //Include model
const methodOverride = require('method-override'); //makes it so we don't have to use the  
//                              javascript approach patch and delete methods (http verbs).


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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); /*makes it so we don't have to use the javascript 
                                    approach patch and delete methods (http verbs).*/

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
//POST route to submit new campground
app.post('/campgrounds/', async (req, res) => {
    console.log(req.body.campground); // in html in name="blah[bloh]" --> req.body.blah.bloh
    const newCampground = new Campground(req.body.campground);
    await newCampground.save().then(r => {
        res.redirect(`/campgrounds/${r._id}`);
    });
    // or can do res.redirect(`campgrounds/%{newCampground._id}`) without .then() 
    // since mongooses creates the id
});
//Show route for single camapground details
app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', { campground });
});
//Get edit form route
app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
});
//PUT route to submit edited campground
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    console.log(req.body.campground); // in html in name="blah[bloh]" --> req.body.blah.bloh
    await Campground.findByIdAndUpdate(id, req.body.campground).then(r => {
        res.redirect(`/campgrounds/${r._id}`);
    });
});
//DELETE route
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;

    await Campground.findByIdAndDelete(id).then(r => {
        console.log('BALEETED!', r);
        res.redirect('/campgrounds/');
    });
})


