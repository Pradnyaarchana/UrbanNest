const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');


router.get('/signup', (req, res) => {
    res.render('users/signup.ejs');
});

router.post('/signup', wrapAsync(async (req, res) => {
    try{
        let { username, email, password } = req.body;
    const user = new User({ username, email });
    const registered = await User.register(user, password);
    console.log(registered);
    req.flash('success', 'Welcome to the UrbanNest!');
    res.redirect('/listings'); 
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
    
}));

router.get('/login', (req, res) => {
    res.render('users/login.ejs');
});

router.post('/login', 
    saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:'/login', 
        failureFlash:true
    }), 
    async (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect(res.locals.redirectUrl || '/listings');
});

router.get('/logout', (req, res,next) => {
    req.logOut((err)=> {
        if (err) {
            return next(err);
        }
        req.flash('success', 'You are are logged out!');
        res.redirect('/listings');
    })
}
);


module.exports = router;