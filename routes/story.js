var express = require('express');
var router = express.Router();
var Story = require('../models/story');
var chance = require('chance').Chance();

router.get('/', function(req, res) {
  Story.find(function(err,stories){
    if (err){
      res.redirect('/');
    } else {
      if (req.isAuthenticated()){
        res.render('stories',{
          hide_option : '',
          username: req.user.displayName,
          gender_img : image,
          endpoint : '/logout',
          button_display:' Log out',
          stories:stories
        });
      } else {
        res.render('stories',{
          hide_option : 'hidden',
          username : null,
          gender_img : '',
          endpoint : '/auth/facebook',
          button_display:' Log in with Facebook',
          stories:stories
        });
      }
    } // else
  });
}); // router get

router.get('/:storyId',function(req,res){
  Story.findOne({storyId:req.params.storyId},function(err,story){
    if (err){
      console.log(err);
    } else {
      // console.log('subject ' + story);
      res.render('story',{story:story});
    }
  });
});

router.post('/new',function(req,res){
  if (req.isAuthenticated()){
    var quotes = [];
    var images = [];
    for (var i = 1; i <= 3; i++){
      var quoteSeq = 'quote' + i;
      var srcSeq = 'src' + i;
      if (req.body[quoteSeq]){
        var quote = {
          quote: req.body[quoteSeq],
          source: req.body[srcSeq]
        }
        // console.log('quote: ' + quote);
        quotes.push(quote);
        // console.log('array: ' + quotes + ' ' + quotes[0]);
      }
      var img_url = 'img' + i;
      var caption = 'caption' + i;
      if (req.body[img_url]){
        // console.log('quote: ' + img_url + ' ' + req.body.img_url);
        var image = {
          url : req.body[img_url],
          caption: req.body[caption]
        }
        images.push(image);
        // console.log('array: ' + images + ' ' + images[0]);
      }
    }
    // var final_img = '';
    // var default_img = '/images/right_supergirl.png';
    // if(!req.body.subject_img){
    //   final_img = default_img;
    // } else {
    //   final_img = req.body.subject_img;
    // }
    var story = new Story({
      storyId : chance.natural({min:1, max:10000}).toString(),
      headline : req.body.headline,
      subject: req.body.subject,
      subject_img : req.body.subject_img,
      author: req.user.displayName,
      twitterAcc : req.body.twitterAcc,
      facebookAcc : req.body.facebookAcc,
      content : req.body.content,
      quotes : quotes,
      images : images
    });
    story.save(function (err,story,next){
      if (err){
        console.log(err);
        return next(err);
      } else {
        // res.render('story',story);
        console.log('Successfully save');
        return (story);
      }
    });
  } else {
    res.redirect('/');
  }
});
module.exports = router;
