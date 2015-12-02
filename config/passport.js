// config/passport.js

// load all the things we need
var FacebookStrategy = require('passport-facebook').Strategy;
// load up the user model
var User = require('../models/user');
// load the auth variables
var configAuth = require('./auth');

// expose this function to our app using module.exports
module.exports = function(passport) {

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // =========================================================================
  // FACEBOOK ================================================================
  // =========================================================================
  passport.use(new FacebookStrategy({

    // pull in our app id and secret from our auth.js file
    clientID        : configAuth.facebookAuth.clientID,
    clientSecret    : configAuth.facebookAuth.clientSecret,
    callbackURL     : configAuth.facebookAuth.callbackURL,
    profileFields   : configAuth.facebookAuth.profileFields
  },

  // facebook will send back the token and profile
  function(token, refreshToken, profile, done) {

    // asynchronous
    process.nextTick(function() {
      // find the user in the database based on their facebook id
      User.findOne({ 'user_facebook_id' : profile.id }, function(err, user) {

        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err)
          return done(err);
        // if the user is found, then log them in
        if (user) {
          // update last active
          user.lastActive = Date.now;
          user.save(function(err) {
            if (err)
              throw err;
            return done(null, user);
          });
        } else {
          // if there is no user found with that facebook id, create them
          var newUser = new User();
          // set all of the facebook information in our user model
          newUser.user_facebook_id = profile.id; // set the users facebook id
          newUser.token = token; // we will save the token that facebook provides to the user
          newUser.displayName = profile.displayName;
          newUser.fullname = profile.name.givenName + ' ' + profile.name.familyName;
          newUser.imageUrl = profile.photos[0].value;
          newUser.gender = profile.gender;
          newUser.email = profile.emails[0].value;
          // save our user to the database
          newUser.save(function(err) {
            if (err)
              throw err;
            // if successful, return the new user
            return done(null, newUser);
          });
        }
      });
    });

  }));

};
