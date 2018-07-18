const express       = require('express');
const navRouter = express.Router();
const User          = require('../models/user');
const bcrypt        = require('bcryptjs');
const passport      = require('passport');
const ensureLogin   = require('connect-ensure-login');

// ABOUT US
navRouter.get('/aboutUs', (req, res, next)=>{
    res.render('aboutUs', {theUser: req.user})
});

// CONTACT US
navRouter.get('/contactUs', (req, res, next)=>{
    res.render('contactUs', {theUser: req.user})
});

module.exports = navRouter;