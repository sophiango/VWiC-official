// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '130919057274195', // your App ID
		'clientSecret' 	: '70d73cc736c22d9252a2b237de5a975b', // your App Secret
		'callbackURL' 	: 'http://localhost:3000/auth/facebook/callback',
		'profileFields': ['id', 'name','picture.type(large)', 'emails', 'displayName', 'gender']
	}

};
