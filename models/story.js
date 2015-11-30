var mongoose = require('mongoose');

var quoteSchema = new mongoose.Schema({
  // quoteId : {type: String, required : true},
  quote: {type: String},
  source: {type: String},
  createdAt : { type: Date, default: Date.now },
}, {_id:false});

var commentSchema = new mongoose.Schema({
  userId : {type: String, required : true},
  username : {type: String, required : true},
  content : {type: String, required : true},
  img_profile : {type:String},
  createdAt : { type: Date, default: Date.now },
}, {_id:false});

var imageSchema = new mongoose.Schema({
    url : {type:String},
    caption : String,
    createdAt : { type: Date, default: Date.now },
}, {_id:false});

var StorySchema = new mongoose.Schema({
  storyId : {type: String, unique: true, required : true},
  headline : {type: String, required : true},
  subject: {type: String, required : true},
  subject_img : String,
  author: {type: String, required : true},
  twitterAcc : String,
  facebookAcc : String,
  createdAt: Date,
  modifiedAt: Date,
  content: String,
  quotes : [quoteSchema],
  images : [imageSchema],
  comments : [commentSchema]
});

StorySchema.pre('save', function(next){
  now = new Date();
  this.modifiedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('Story',StorySchema);
