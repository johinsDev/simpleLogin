var mongoose = require('mongoose');
var bcrypt = require('bcryptjs')

mongoose.connect('mongodb://localhost/auth');

var db = mongoose.connection;

//User Schema

var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index:true,
        unique:true
    },
    password:{
        type: String
    },
    email:{
        type: String
    },
    avatar:{
        type:String
    }
});

var User = module.exports = mongoose.model('User' , UserSchema);

module.exports.create = (data , callback) => {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(data.password, salt, function(err, hash) {
            data.password = hash;
            data.save(callback);
        });
    });
};