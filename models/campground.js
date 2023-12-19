const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const ImageSchema = new Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function () {
    // puts w_200 in the url which tells cloudinary to send a image only 200 px wide.
    if (this.filename != null) {
        return this.url.replace('/upload', '/upload/w_200');
    } else {
        return this.url;
    }
});
ImageSchema.virtual('thumbnailable').get(function () {
    // if this is a cloudinary image, return that it is thumbnail-able
    if (this.filename != null) {
        return true;
    } else {
        return false;
    }
});


const CampgroundSchema = new Schema({
    title: String,
    image: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

//Delete middleware
CampgroundSchema.post('findOneAndDelete', async function (campground) {
    console.log('Deleted --from mongoose middleware.');

    if (campground) {
        let res = await Review.deleteMany({ _id: { $in: campground.reviews } });
        console.log(res);
    }
});


//Must define middleware before the export.
module.exports = mongoose.model('Campground', CampgroundSchema);