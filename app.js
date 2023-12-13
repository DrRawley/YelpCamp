const express = require('express');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground'); //Include models
const Review = require('./models/review');
const methodOverride = require('method-override'); //makes it so we don't have to use the  
//                              javascript approach patch and delete methods (http verbs).
const ejsMate = require('ejs-mate'); //allows to make templates in our .ejs files


//Error handing requires
const ExpressError = require('./utils/ExpressError.js');
const catchAsync = require('./utils/catchAsync.js');

// ************** Start Mongoose *****************
mongoose.connect('mongodb://localhost:27017/yelp-camp');
// The following mongoose options are no longer needed
// { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
const db = mongoose.connection; //db is just a shortcut to avoid typing mongoose.connection all the time
// catch mongoose db connection errors
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected.");
});

// *********** Express middleware declarations *****************************
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs'); //set default view engine to ejs
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); /*makes it so we don't have to use the javascript 
                                    approach patch and delete methods (http verbs).*/
app.use(express.static(path.join(__dirname, 'public'))); //Set up public directory
//Set up express session
const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //expire in a week in ms
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
};
app.use(session(sessionConfig));
//Enable flash
app.use(flash());


// ********* Start Express Listening ************                                    
app.listen(3000, () => {
    console.log("Listening on port 3000...");
});

// Define flash message handlers
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//Basic route for initial testing
app.get('/', (req, res) => {
    res.render('home');
});

// ************************** CAMPGROUND ROUTES *****************************
//Require Campground route files
const campgrounds = require('./routes/campgrounds.js');
app.use('/campgrounds', campgrounds);

// ************************** REVIEW ROUTES *********************************
//Require Campground route files
const reviews = require('./routes/reviews.js');
app.use('/campgrounds/:id/reviews', reviews);

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

