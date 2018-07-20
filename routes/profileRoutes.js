const express       = require('express');
const profileRouter = express.Router();
const User          = require('../models/user');
const bcrypt        = require('bcryptjs');
const passport      = require('passport');
const ensureLogin   = require('connect-ensure-login');
const multer        = require('multer');
const uploadCloud   = require('../config/cloudinary');
const localstore        = multer({dest: './public/uploads/'})
const cloudinary    = require('cloudinary');

const Video         = require('../models/video');
const Comment       = require('../models/comment');

cloudinary.config({
    cloud_name: process.env.cloudName,
    api_key: process.env.cloudKey,
    api_secret: process.env.cloudSecret
  });
  
  // PROFILE
profileRouter.get('/profile', ensureLogin.ensureLoggedIn(), (req, res, next)=>{
    Video.find()
    .then(videosFromDB => {
        res.render('userViews/profilePage', {videosFromDB, theUser: req.user})
    })
 });

// EDIT PROFILE
profileRouter.get('/profile/:id/update', (req, res, next)=>{
   User.findById(req.params.id)
   .then((theUser)=>{
       console.log("user info >>>>>>>>>> ", theUser);

       res.render('../views/userViews/editProfile', {theUser})
   }) 
});

profileRouter.post('/profile/:id/update', uploadCloud.single('photo'), (req, res, next)=>{
    // console.log("***************** ", req.file)
    User.findById(req.params.id)
    .then((theUser)=>{
        theUser.name= req.body.name;
        theUser.about= req.body.about;
        if(req.file){
            theUser.image= req.file.url;
        }

        theUser.save()
        .then((response)=>{
            console.log("the user line 47 :::::::::::::::: ", response)
            res.redirect('/profile');
        })
        .catch((err)=>{
            console.log("update did not work ++++++++++++++")
            next(err);
        });

    })

    });

// CREATE VIDEO
profileRouter.get('/video/create', ensureLogin.ensureLoggedIn(), (req, res, next)=>{
    res.render('videoViews/newVideo', {theUser: req.user})
});

profileRouter.post('/video/create', localstore.single('video'), (req, res, next)=>{
    const newVideo = new Video({
        title: req.body.title,
        description: req.body.description,
        // url: '/uploads/'+req.file.filename,
        mediaName: req.file.originalname,
        userID: req.user.id
    })
        
        cloudinary.v2.uploader.upload('./public/uploads/'+req.file.filename, {resource_type: 'video'}, function(error,result){
            console.log("=============================================", result, error)
            newVideo.url = result.url;
            
            newVideo.save()
            .then((response)=>{
                res.redirect('/profile');
            })
            .catch((err)=>{
                next(err);
            });
             
        })
});


// EDIT VIDEO
profileRouter.get('/video/:id/update', (req, res, next)=>{
    Video.findById(req.params.id)
    .then((theVideo)=>{
        res.render('../views/videoViews/editVideo', {theVideo})
    })
});

profileRouter.post('/video/:id/update', (req, res, next)=>{
    const newVideo = new Video({
        title: req.body.title,
        description: req.body.description
    })
    newVideo.save()
    .then((response)=>{
        res.redirect('../views/videoViews/videoPage');
    })
    .catch((err)=>{
        next(err);
    });
});

// COMMENT
profileRouter.post("/video/:id/comment/create", (req, res, next) => {
    const comment = new Comment({
        username: req.user.username,
        userID: req.user._id,
        comment: req.body.vidComment,
        mediaId: req.params.id
    });
    comment.save()
    .then((commentFromDB) => {
            res.redirect(`/video/${req.params.id}`);
        })
        .catch((err) => {
            next(err);
        });
    })

// 1 VIDEO
profileRouter.get('/video/:id', ensureLogin.ensureLoggedIn(), (req, res, next)=>{
    Video.findById(req.params.id)
    .then((videoFromDB) => {
            Comment.find({mediaId:req.params.id})
            .then((theComments)=>{
                res.render('videoViews/videoPage', {theUser: req.user, theVideo: videoFromDB, theComments: theComments})

            })




    });
 });


//DELETE
profileRouter.post('/video/:id/delete', (req, res, next)=>{
    Video.findByIdAndRemove(req.params.id)
    .then((reponse)=>{
        res.redirect('../views/videoViews/editVideo.hbs');
    })
    .catch((err)=>{
        next(err);
    });
});

// SEARCH 
profileRouter.get('/search', (req, res, next) => {
    console.log("the search term ================= ", req.body.searchTerm)
    Video.find({title: req.query.searchTerm})
    .then((responseFromDB) => {
        console.log("result of the search $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ ", responseFromDB);
        if(responseFromDB.length !== 0){
            var list = responseFromDB[0].comments
            console.log(">>>>> found something <<<<<", list);
            Comment.find({_id: {$in: list}})
            .then((commentsFromDB) => {
                console.log("these are the comments after a search ---------------------------- ", commentsFromDB);
                data = {
                    theVideo: responseFromDB[0],
                    theComments: commentsFromDB
                }
                res.render('videoViews/videoPage', data);
            })
        } else {
            console.log("<<<<<<<< found not a damn thing >>>>>>>>>>>");
            return;
            // res.redirect("/");
        }
    })
    .catch((err) => {
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