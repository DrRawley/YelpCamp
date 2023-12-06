const express = require('express');
const app = express();

app.listen(3000, () => {
    console.log("Listening on port 3000...");
});

app.get('/', (req, res) => {
    res.send('<h1>YelpCamp!</h1><h3>\"This works, apparently.\" --Future Crew</h3>');
});
