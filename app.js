require('dotenv').config();

const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');
const express       = require('express');
const favicon       = require('serve-favicon');
const hbs           = require('hbs');
const mongoose      = require('mongoose');
const logger        = require('morgan');
const path          = require('path');
const session       =require('express-session');
const app           = express();
const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt        = require('bcryptjs');
const flash         = require('connect-flash');
const ensureLogin   = require('connect-ensure-login');

// Connect each model
const User          = require('./models/user')
const Comment       = require('./models/comment');
const Video         = require('./models/video');



mongoose.Promise = Promise;
mongoose
  .connect(process.env.MONGODB_URI, {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use(session({
  secret: "youtube-thing",
  resave: true,
  saveUninitialized: true
}));

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

passport.serializeUser((user, cb)=>{
  // what is cb?
  cb(null, user._id)
})

passport.deserializeUser((id, cb)=>{
  User.findById(id, (err, user)=>{
    if(err) {return cb(err);}
    cb(null, user)
  });
});

app.use(flash());

passport.use(new LocalStrategy((username, password, next) => {
  console.log("using local strategy")
  User.findOne({ username }, (err, user) => {
    if (err) {
      console.log("error in DB error error errorr")
      return next(err);
    }
    if (!user) {
      console.log("NO USR WITH THAT USERNAME")
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      console.log("its the wrong password")
      return next(null, false, { message: "Incorrect password" });
    }
    console.log("all the way to the end of local stragey", user)
    return next(null, user);
  });
}));

// app.use ((req, res, next)=>{
//   if(req.user){
//     res.locals.user = req.user; // !!!!!!
//   }
//   next();
//  })

app.use(passport.initialize());
app.use(passport.session());

const index = require('./routes/index');
app.use('/', index);

const userRoutes = require('./routes/userRoutes');
app.use('/', userRoutes);

const profileRoutes = require('./routes/profileRoutes');
app.use('/', profileRoutes);

const navRoutes = require('./routes/navRoutes');
app.use('/', navRoutes);

module.exports = app;
