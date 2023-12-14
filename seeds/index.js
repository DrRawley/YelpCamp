const loremIpsum = require("lorem-ipsum").loremIpsum;
const mongoose = require('mongoose');
const Campground = require('../models/campground'); //Include models
const User = require('../models/user')
const cities = require('../seeds/cities');
const { descriptors, places } = require('../seeds/seedHelpers');
const images = require('../seeds/images');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected.");
});

//Load in base directory, execute from shell
const deleteWholeDB = async () => {
    await Campground.deleteMany({}); //delete everything to make good fake database
};

//Quick function to get a random element from an array
const sample = array => array[Math.floor(Math.random() * array.length)];

//Seed database using cities and seedHelpers
const seedDB = async () => {
    for (let i = 0; i < 50; i++) {
        const rand1000 = Math.floor(Math.random() * 1000);

        const camp = new Campground({
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }
};

//Update database
const updateDB = async () => {
    const campgrounds = await Campground.find({});
    const users = await User.find({});
    console.log(users);

    for (let i in campgrounds) {
        //await Campground.findByIdAndUpdate(campgrounds[i]._id, { image: sample(images) });
        //await Campground.findByIdAndUpdate(campgrounds[i]._id, { description: loremIpsum({ count: 3 }) });
        //await Campground.findByIdAndUpdate(campgrounds[i]._id, { price: (Math.floor(Math.random() * 40) + 10) });
        let randUser = sample(users);
        console.log(randUser);
        await Campground.findByIdAndUpdate(campgrounds[i]._id, { author: randUser._id });

    }
}


