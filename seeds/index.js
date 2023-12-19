if (process.env.NODE_ENV !== "production") { //For reading development .env keys
    require('dotenv').config({ path: '../.env' });
}

const loremIpsum = require("lorem-ipsum").loremIpsum;
const mongoose = require('mongoose');
const Campground = require('../models/campground'); //Include models
const Review = require('../models/review'); //Include models
const User = require('../models/user')
const cities = require('../seeds/cities');
const { descriptors, places } = require('../seeds/seedHelpers');
const images = require('../seeds/images');
//Mapbox
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });

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
//Update review database
const updateReviewDB = async () => {
    const reviews = await Review.find({});
    const users = await User.find({});
    console.log(users);

    for (let i in reviews) {
        let randUser = sample(users);
        console.log(randUser);
        await Review.findByIdAndUpdate(reviews[i]._id, { author: randUser._id });

    }
}
//Migrate image info to images
const migrateImages = async () => {
    const campgrounds = await Campground.find({});
    for (let i in campgrounds) {
        const campground = await Campground.findById(campgrounds[i]._id);
        const newImage = { url: campground.image, filename: null };
        campground.images.push(newImage);
        campground.save();
    }
}
//Populate geo data
const addCoordinates = async () => {
    const campgrounds = await Campground.find({});

    for (let i in campgrounds) {
        const campground = await Campground.findById(campgrounds[i]._id);

        const geoData = await geocoder.forwardGeocode({
            query: campground.location,
            limit: 1
        }).send();
        //console.log(geoData.body.features[0].geometry.coordinates);

        campground.geometry = geoData.body.features[0].geometry;
        console.log(campground.geometry);

        campground.save();
    }

}

