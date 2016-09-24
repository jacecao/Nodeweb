var mongoose = require('mongoose');
var UserSchema = require('../schemas/user.js');

var Users = mongoose.model('User',UserSchema);

module.exports = Users; 