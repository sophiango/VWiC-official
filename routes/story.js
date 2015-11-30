var express = require('express');
var router = express.Router();
var Story = require('../models/story');
var chance = require('chance').Chance();
router.get('/', function(req, res) {
  console.log('call here');
  Story.find(function(err,stories){
    if (err){
      console.log(err);
    } else {
      res.render('stories',
        {stories:stories}
      );
    }
  });
});
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

// router.get('/new',function(req,res){
//   res.render('edit');
// });

router.post('/new',function(req,res){
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
  var final_img = '';
  var default_img = 'http://fc08.deviantart.net/fs25/f/2009/248/5/3/537bbf42c151fa505bb579b50649a4ba.jpg';
  if(!req.body.subject_img){
    final_img = default_img;
  } else {
    final_img = req.body.subject_img;
  }
  var story = new Story({
    storyId : chance.natural({min:1, max:10000}).toString(),
    headline : req.body.headline,
    subject: req.body.subject,
    subject_img : final_img,
    author: 'sophia',
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
});
module.exports = router;
