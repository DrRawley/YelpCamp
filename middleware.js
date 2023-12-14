
module.exports.isLoggedIn = (req, res, next) => {
    console.log(`req.user: ${req.user}`);
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in to do that.');
        return res.redirect('/login');
    }
    next();
}

