const User = require('../models/user.js');
module.exports.renderSignup =  (req, res) => {
    res.render('users/signup.ejs');
}

module.exports.signup = async (req, res) => {
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
    
}


module.exports.renderLogin = (req, res) => {
    res.render('users/login.ejs');
}

module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect(res.locals.redirectUrl || '/listings');
}

module.exports.logout = (req, res,next) => {
    req.logOut((err)=> {
        if (err) {
            return next(err);
        }
        req.flash('success', 'You are logged out!');
        res.redirect('/listings');
    })
}