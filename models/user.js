var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var StorySchema = mongoose.Schema({
  subject: String,
  headline: String,
  storyId: String
});

var UserSchema = mongoose.Schema({
  user_facebook_id : {type: String, unique: true},
  token : String,
  displayName : String,
  fullName : String,
  imageUrl : String,
  gender : String,
  email : String,
  created_stories : [StorySchema],
  inspired_stories : [StorySchema],
  last_active : {type:Date, default: Date.now}
});

// UserSchema.pre('save', function(next){
//   now = new Date();
//   this.lastActive = now;
//   if ( !this.createdAt ) {
//     this.createdAt = now;
//   }
//   next();
// });

module.exports = mongoose.model('User',UserSchema);
