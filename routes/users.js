var express = require('express');
var router = express.Router();
var multer = require('multer');
var passport = require('passport');
//Handle File Uploads
var upload = multer({dest: './uploads'});

var User = require('../models/user');
var localStratergy = require('passport-local').Strategy;

/* GET users listing. */
router.get('/sign_in', function(req, res, next) {
  res.render('users/sign_in', {title: 'Login'})
});

router.post('/sign_in',
    passport.authenticate('local'),
    { failureRedirect: '/sign_in' , failureFlash: 'Invalid username or password.' },
    (req, res) =>{
        req.flash('success' , 'You are now logged in');
        res.redirect('/');
});

passport.use(new localStratergy((username) => {

}));

router.get('/sign_up', function(req, res, next) {
    res.render('users/sign_up' , {title: 'Register'})
});

router.post('/sign_up' , upload.single('avatar') , (req, res , next) => {
    const avatar = req.file ? req.file.filenam :  'noimage.jpg';

    //form validation
    req.checkBody('name' , 'Name field Is Required').notEmpty();
    req.checkBody('email' , 'email field Is Required').notEmpty();
    req.checkBody('email' , 'Email is not valid').isEmail();
    req.checkBody('username' , 'Username field Is Required').notEmpty();
    req.checkBody('password' , 'Password field Is Required').notEmpty();
    req.checkBody('password_confirmation' , 'Passwords do not match').equals(req.body.password);

    //Check  Errors
    var errors = req.validationErrors();

    if (errors){
        res.render('users/sign_up' , {
            errors: errors
        })
    }else{
        var data = {
            'name': req.body.name,
            'email': req.body.email,
            'password': req.body.password,
            'avatar': avatar,
        };
        var user = new User(data);
        User.create(user ,  (err) => {
            if (err) throw err;
        });

        req.flash('success' , 'You are now registed and can loggin');

        res.location('/');
        res.redirect('/');
    }

});

module.exports = router;
