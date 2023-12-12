const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground'); //Include models
const Review = require('./models/review');
const methodOverride = require('method-override'); //makes it so we don't have to use the  
//                              javascript approach patch and delete methods (http verbs).
const ejsMate = require('ejs-mate'); //allows to make templates in our .ejs files
const Joi = require('joi');
const { campgroundSchema } = require('./schemas.js');
const { reviewSchema } = require('./schemas.js');

//Error handing requires
const ExpressError = require('./utils/ExpressError.js');
const catchAsync = require('./utils/catchAsync.js');

mongoose.connect('mongodb://localhost:27017/yelp-camp');
// The following mongoose options are no longer needed
// { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }

const db = mongoose.connection; //db is just a shortcut to avoid typing mongoose.connection all the time
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected.");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs'); //set default view engine to ejs
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); /*makes it so we don't have to use the javascript 
                                    approach patch and delete methods (http verbs).*/


//********* JOI Schema Validations **********************************/
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
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}




app.listen(3000, () => {
    console.log("Listening on port 3000...");
});

//Basic route for initial testing
app.get('/', (req, res) => {
    res.render('home');
});

// ********* CAMPGROUND ROUTES **************

//Route for campground index
app.get('/campgrounds/', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));
//Route to get form for a new campground (come before :id or crash)
app.get('/campgrounds/new/', (req, res) => {
    res.render('campgrounds/new');
});
//POST route to submit new campground
app.post('/campgrounds/', validateCampground, catchAsync(async (req, res, next) => {

    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`campgrounds/${newCampground._id}`);

}));
//Show route for single campground details
app.get('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', { campground });
}));
//Get edit form route
app.get('/campgrounds/:id/edit', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
}));
//PUT route to submit edited campground
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    console.log(req.body.campground); // in html in name="blah[bloh]" --> req.body.blah.bloh
    await Campground.findByIdAndUpdate(id, req.body.campground).then(r => {
        res.redirect(`/campgrounds/${r._id}`);
    });
}));
//DELETE route
app.delete('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;

    await Campground.findByIdAndDelete(id).then(r => {
        console.log('BALEETED!', r);
        res.redirect('/campgrounds/');
    });
}))

// ********* REVIEW ROUTES **************

//Route to submit new review
app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res, next) => {
    let { id } = req.params;
    let campground = await Campground.findById(id);
    let review = new Review(req.body.review);
    console.log(review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();

    res.redirect(`/campgrounds/${campground._id}`);
}));


// ********** ERROR ROUTE CATCHALL ***********
//Set up 404
app.all('*', (req, res, next) => {
    next(new ExpressError('<img src=\"https://placehold.co/404x404?text=404&font=raleway\">', 404));
})




//Set up error handlers

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong.';
    res.status(statusCode).render('error', { err });

    //next(err);
})

