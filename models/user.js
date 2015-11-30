var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// var UserSchema = new mongoose.Schema({
//   userId : {type: String, unique: true},
//   email : {type: String, unique: true},
//   user_img : String,
//   createdAt: Date,
//   lastActive: Date
// });

var UserSchema = mongoose.Schema({
  facebook : {
        id : {type: String, unique: true},
        token : String,
        displayName : String,
        profileUrl : String,
        gender : String,
        last_active : {type:Date, default: Date.now}
    }
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
