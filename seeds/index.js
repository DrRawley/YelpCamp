const mongoose = require('mongoose');
const Campground = require('./models/campground'); //Include model

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected.");
});

const seedDB = async () => {
    await Campground.deleteMany({}); //delete everything to make good fake database
};