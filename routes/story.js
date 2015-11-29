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
router.post('/new',function(req,res){
  var story = new Story({
    storyId : chance.natural({min:1, max:10000}).toString(),
    headline : req.body.headline,
    subject: req.body.subject,
    subject_img : req.body.subject_img,
    author: 'sophia',
    twitterAcc : req.body.twitterAcc,
    facebookAcc : req.body.facebookAcc,
    content : req.body.content
  });
  story.save(function (err,story){
    if (err){
      console.log(err);
    } else {
      // res.render('story',story);
      console.log('Successfully save');
    }
    });
});
module.exports = router;
