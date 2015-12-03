var chance = require('chance').Chance();
// config/passport.js

// load all the things we need
var FacebookStrategy = require('passport-facebook').Strategy;
// load up the user model
var User = require('../models/user');
// load the auth variables
var configAuth = require('./auth');

var fb_default_male_img = 'https://scontent.xx.fbcdn.net/hprofile-xfa1/v/t1.0-1/s200x200/10354686_10150004552801856_220367501106153455_n.jpg?oh=3d28110b4889284a44dcf3b9a346d99d&oe=56E86650';
var fb_default_female_img = 'https://scontent.xx.fbcdn.net/hprofile-xla1/v/t1.0-1/s200x200/1379841_10150004552801901_469209496895221757_n.jpg?oh=3fa29a859650d406793272ee7cff2a64&oe=56EFB3F8';
var vwic_default_female_img = 'https://api.icons8.com/download/394ff97750654c24ef003d36092b3dafa4679e17/Color/PNG/144/Very_Basic/user_female-144.png';
var vwic_default_male_img = 'https://api.icons8.com/download/4ef7a2fc605db06baac2320c471f9fde67cd0209/Color/PNG/144/Very_Basic/user_male-144.png';

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
      User.findOne({ 'user_id' : profile.id }, function(err, user) {

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
          // console.log('data: ' + JSON.stringify(profile));
          // if there is no user found with that facebook id, create them

          var newUser = new User();
          // set all of the facebook information in our user model
          newUser.user_id = profile.id; // set the users facebook id
          newUser.token = token; // we will save the token that facebook provides to the user
          newUser.displayName = profile.displayName;
          newUser.fullname = profile.name.givenName + ' ' + profile.name.familyName;
          if (profile.photos[0].value===fb_default_female_img){
            newUser.imageUrl = vwic_default_female_img;
          } else if (profile.photos[0].value===fb_default_male_img){
            newUser.imageUrl = vwic_default_male_img;
          } else {
            newUser.imageUrl = profile.photos[0].value;
          }
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
