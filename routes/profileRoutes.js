const express       = require('express');
const profileRouter = express.Router();
const User          = require('../models/user');
const bcrypt        = require('bcryptjs');
const passport      = require('passport');
const ensureLogin   = require('connect-ensure-login');

// PROFILE
profileRouter.get('/profile', (req, res, next)=>{
    res.render('userViews/profilePage', {theUser: req.user})
});


// EDIT PROFILE
profileRouter.get('/profile/update', (req, res, next)=>{
    res.render('../views/userViews/editProfile.hbs', {theUser: req.user})
});

profileRouter.post('/profile/update', (req, res, next)=>{
    const newVideo = new Video({
        title: req.body.title,
        description: req.body.description
    })
    newVideo.save()
    .then((response)=>{
        res.redirect('../views/userViews/editProfile.hbs');
    })
    .catch((err)=>{
        next(err);
    })
});


// CREATE VIDEO
profileRouter.get('/video/create', (req, res, next)=>{
    res.render('../views/videoViews/newVideo.hbs', {theUser: req.user})
});

profileRouter.post('/video/create', (req, res, next)=>{
    const newVideo = new Video({
        title: req.body.title,
        description: req.body.description
    })
    newVideo.save()
    .then((response)=>{
        res.redirect('../views/videoViews/newVideo.hbs');
    })
    .catch((err)=>{
        next(err);
    })
});


// EDIT VIDEO
profileRouter.get('/video/update', (req, res, next)=>{
    res.render('../views/videoViews/editVideo.hbs', {theUser: req.user})
});

profileRouter.post('/video/update', (req, res, next)=>{
    const newVideo = new Video({
        title: req.body.title,
        description: req.body.description
    })
    newVideo.save()
    .then((response)=>{
        res.redirect('../views/videoViews/editVideo.hbs');
    })
    .catch((err)=>{
        next(err);
    })
});


//DELETE
profileRouter.post('/video/:id/delete', (req, res, next)=>{
    Video.findByIdAndRemove(req.params.id)
    .then((reponse)=>{
        res.redirect('../views/videoViews/editVideo.hbs');
    })
    .catch((err)=>{
        next(err);
    })
})









// profileRouter.get('/:id/profile', (req, res, next)=>{
//     User.findById(req.params.id)
//     .then(()=>{
        
//     })
//     res.render('userViews/profilePage');
// });

// profileRouter.post('/:id/profile',(req, res, next)=>{
    
//         res.render('userViews/profilePage');
//         return;
//     });



module.exports = profileRouter;