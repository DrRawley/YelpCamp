
module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;  //tracks url unlogged user was trying to access
        req.flash('error', 'You must be logged in to do that.');
        return res.redirect('/login');
    }
    next();
}

//stores the returnTo url in locals because the new passport clears the session
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
        console.log('In storeReturnTo()', r);
    }
    next();
}
