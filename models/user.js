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
  facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }
});

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


// this method hashes the password and sets the users password
UserSchema.methods.hashPassword = function(password) {
    var user = this;

    // hash the password
    bcrypt.hash(password, null, null, function(err, hash) {
        if (err)
            return next(err);

        user.local.password = hash;
    });

};

// UserSchema.pre('save', function(next){
//   now = new Date();
//   this.lastActive = now;
//   if ( !this.createdAt ) {
//     this.createdAt = now;
//   }
//   next();
// });

module.exports = mongoose.model('User',UserSchema);
