var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index');
// });

module.exports = function(passport){

  router.get('/', function(req, res) {
    if (req.isAuthenticated()){
      var image = '/images/'+req.user.gender+'.png';
      res.render('index', {
        hide_option : '',
        username: req.user.displayName,
        gender_img : image,
        endpoint : '/logout',
        button_display:' Log out'
      });
    } else {
      res.render('index', {
        hide_option : 'hidden',
        username : null,
        gender_img : '',
        endpoint : '/auth/facebook',
        button_display:' Log in with Facebook'
      });
    }
  });

  router.get('/story/new',function(req,res){
    if (req.isAuthenticated()){
      res.render('edit',{
        username: req.user.displayName,
        gender_img : image
      });
    } else {
      res.redirect('/story');
    }
  });

  // =====================================
  // PROFILE SECTION =========================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  router.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile', {
      user : req.user // get the user out of session and pass to template
    });
  });

  // router.get('/profile', function(req, res) {
  //   res.render('profile');
  // });

  // =====================================
  // FACEBOOK ROUTES =====================
  // =====================================
  // route for facebook authentication and login
  router.get('/auth/facebook', passport.authenticate('facebook', { scope :['email']}));

  // handle the callback after facebook has authenticated the user
  router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect : '/profile',
    failureRedirect : '/'
  }));

  // =====================================
  // LOGOUT ==============================
  // =====================================
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
  return router;
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
  return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}
