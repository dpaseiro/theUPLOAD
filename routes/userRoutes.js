const express    = require('express');
const userRouter = express.Router();
const User       = require('../models/user');
const bcrypt     = require('bcryptjs');
const passport   = require('passport');


// SIGNUP
userRouter.get('/signup', (req, res, next)=>{
   res.render('userViews/signupPage');
})

userRouter.post('/signup', (req, res, next) =>{
    const thePassword = req.body.thePassword;
    const theUsername = req.body.theUsername;
    if(thePassword === '' || theUsername === ''){
        res.render('userViews/signupPage', {errorMessage: 'Input a username and password to create an account.'})
        return;
    }
    User.findOne({'username': theUsername})
    .then((responseFromDB)=>{
        if (responseFromDB !== null){
            res.render('userViews/signupPage', {errorMessage: `Sorry, the username ${theUsername} is taken. Please choose another name`})
            return;
        }
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(thePassword, salt);
        User.create({username: theUsername, password: hashedPassword})
        .then((response)=>{
            res.redirect('/');
        })
        .catch((err)=>{
            next(err);
        })
    })
})

// LOGIN
userRouter.get('/login', (req, res, next)=>{
    res.render('userViews/loginPage', {message: req.flash('error')});
});

userRouter.post('/login', passport.authenticate('local', {
    successRedirect: '/profilePage',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true
}));

// LOGOUT
userRouter.get('/logout', (req, res, next)=>{
    req.logout();
    res.redirect('/login')
});



module.exports = userRouter;