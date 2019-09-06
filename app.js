const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const session = require("express-session");
const uuid = require('uuid/v4')
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const format = require('format')
const config = require('config');
const dbConfig = config.get('Config.MongoDB');
const MongoClient = require('mongodb').MongoClient;
const flash = require('connect-flash');

const dashboardRouter = require("./routes/dashboard");

passport.use(new LocalStrategy(
  function (username, password, done) {
      const url = format(dbConfig.uri, username, password);
      const user = {username:username, password:password};
      MongoClient.connect(url, { useNewUrlParser: true , useUnifiedTopology: true }, function(err, client) {
        if (err) {
          return done(null, false, { message: 'Authenication failed.' });
        } else {
          client.close();
          return done(null, user);
        }
      }
    );
  }
));
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  done(null, id);
});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  genid: (req) => {
    console.log('Inside the session middleware')
    return uuid()
  },
  store: new FileStore(),
  secret: 'snTuAGM_fQxNNK7nynUmNj3AK6-ygiLpVUowt-K9*Emnq.Xv7oFzLPDUCUsEc!6F',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const sessionChecker = (req, res, next) => {
  if (req.isAuthenticated()) {
      res.locals.user = req.user.username;
      next();
  } else {
      res.locals.user = null;
      res.redirect('/login');
  }    
};

app.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login', message: req.flash("error")});
  });

app.post('/login', 
  passport.authenticate('local', { successRedirect:'/', failureRedirect: '/login', failureFlash : true }));


app.get('/logout', sessionChecker, (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/', sessionChecker, (req, res) => {
  res.redirect('/dashboard');
});

app.use('*', sessionChecker);

app.use('/dashboard', dashboardRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;