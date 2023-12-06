const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/yelp-camp');
// The following mongoose options are no longer needed
// {   useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true}

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
    //res.send('<h1>YelpCamp!</h1><h3>\"This works, apparently.\" --Future Crew</h3>');
    res.render('home');
});
