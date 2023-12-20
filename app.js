if (process.env.NODE_ENV !== "production") { //For reading development .env keys
    require('dotenv').config();
}

const express = require('express');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const methodOverride = require('method-override'); //makes it so we don't have to use the  
//                              javascript approach patch and delete methods (http verbs).
const ejsMate = require('ejs-mate'); //allows to make templates in our .ejs files
const passport = require('passport');
const localStrategy = require('passport-local');
const helmet = require('helmet'); //helmet security
//Include models
const Campground = require('./models/campground');
const Review = require('./models/review');
const User = require('./models/user.js');

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
app.use(mongoSanitize());  //Use the sanitizer to help prevent db injection attacks
//Set up express session
const sessionConfig = {
    name: 'session', //should probably change this
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //expire in a week in ms
        maxAge: 1000 * 60 * 60 * 24 * 7,
        //secure: true, //only allow cookies over https://
        httpOnly: true
    }
};
app.use(session(sessionConfig));
//Enable flash
app.use(flash());
//Enable helmet
app.use(helmet());
//app.use(helmet({ contentSecurityPolicy: false }));
//Setup helmet
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://events.mapbox.com/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://cdn.jsdelivr.net/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/"
];
const connectSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://tiles.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://cdn.jsdelivr.net/",
    "https://events.mapbox.com/"

];
const fontSrcUrls = [];
const imgSrcUrls = [
    "https://res.cloudinary.com/dwu3qgva6/",
    "https://images.unsplash.com/",
    "*" //Allow ALL images from anywhere.  Should probably limit this in the future.
];
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: [],
                connectSrc: ["'self'", ...connectSrcUrls],
                scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls], //should use nonce instead of unsafe-inline
                styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
                workerSrc: ["'self'", "blob:"],
                objectSrc: ["'self'"],
                imgSrc: ["'self'", "blob:", "data:", ...imgSrcUrls],
                fontSrc: ["'self'", ...fontSrcUrls]
            }
        }
    })
);




//Initialize passport
app.use(passport.initialize());
app.use(passport.session()); //Needs to come after express session
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ********* Start Express Listening ************                                    
app.listen(3000, () => {
    console.log("Listening on port 3000...");
});

// Define flash message handlers, and logged in info
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// ******************** Basic routes for initial testing ********************
app.get('/', (req, res) => {
    res.render('home');
});
app.get('/fakeUser', async (req, res, next) => {
    // const user = new User({ email: 'bob@whitehouse.gov', username: 'bob' });
    // const newUser = await User.register(user, 'marley');
    // res.send(newUser)
});


// ******************* User Registration ROUTES *****************************
//Require User Registration route files
const userRoutes = require('./routes/users.js');
app.use('/', userRoutes);

// ************************** CAMPGROUND ROUTES *****************************
//Require Campground route files
const campgroundRoutes = require('./routes/campgrounds.js');
app.use('/campgrounds', campgroundRoutes);

// ************************** REVIEW ROUTES *********************************
//Require Campground route files
const reviewRoutes = require('./routes/reviews.js');
app.use('/campgrounds/:id/reviews', reviewRoutes);

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

