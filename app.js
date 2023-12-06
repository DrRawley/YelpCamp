const express = require('express');
const app = express();
const path = require('path');

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
