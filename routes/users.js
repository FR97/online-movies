
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Get all users ||||| ADMIN ONLY
router.get('/',(req, res)=>{
    User.find({}, (err, users) =>{
        if(res.locals.user){
            if(res.locals.user.role ==='admin'){
                res.render('users', {users: users, page: 'all-users'});
            }else{
                res.redirect('/users/profile');
            }
        }
        else{
            res.redirect('/users/login');
        }

    });
});

// Get Register
router.get('/register', (req, res)=>{
    res.render('register',{page: 'register'});
});

// Get Login
router.get('/login',(req, res)=>{
    res.render('login',{page: 'login'});
});

// Get Profile
router.get('/profile',(req, res)=>{
    if(res.locals.user){
        res.render('profile', { user: res.locals.user,page: 'profile' } );
    }else{
        res.redirect('/users/login');
    }
});

// Post Register
router.post('/register', (req, res)=>{

    var username = req.body.username;
    var email = req.body.email;
    var pass = req.body.pass;
    var passConf = req.body.passConf;

    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('username', 'Username must be at least 2 characters long').len(2);
    req.checkBody('username','Username can only contain letters and numbers').isAlphanumeric();

    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', "Email isn't valid").isEmail();

    req.checkBody('pass', 'Password must contain at least 1 number, 1 uppercase and 1 lowercase letter and be at least 8 characters long')
        .matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
    req.checkBody('passConf', "Passwords don't match").equals(req.body.pass);
    req.getValidationResult().then((result)=> {
        if (!result.isEmpty()) {
            /*
            var errors = result.array().map(function (elem) {
                return elem.msg;
            });*/
            res.render('register',{errors:result.array()});

        } else {
            var newUser = new User({username: username, email: email, password: pass, role: 'std_user'});
            User.createUser(newUser, (err, user)=>{
                if(err) throw err;
            });
            req.flash('success_msg','Registration complited, you can now login!');
            res.redirect('/users/login');
        }
    });
});

// Passport verification
passport.use(new LocalStrategy(
    (username, password, done) =>{
        User.findByUsername(username, (err, user)=>{
            if(err) throw err;
            if(!user) {
                return done(null, false, {message:"Username doesn't exsist"});
            }
            User.comparePasswords(password, user.password, (err, isMatch) => {
                if(isMatch){
                    return done(null, user);
                }else{
                    return done(null, false, {message:"Password doesn't match"});
                }
            });
        });
    }
));

passport.serializeUser((user, done) =>{
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.getById(id, (err, user) =>{
        done(err, user);
    });
});

// Post Login
// Copy-paste from passport docs
router.post('/login',
    passport.authenticate('local', {successRedirect:"/", failureRedirect: "/users/login", failureFlash: true}),
    (req, res)=> {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        // res.redirect('/users/' + req.user.username);
        res.redirect('/');
    });

// Get Logout
router.get('/logout',(req, res)=>{
    req.logout();
    req.flash('success_msg', 'You are logged out successfully!');
    res.redirect('/users/login');
});


module.exports = router;
