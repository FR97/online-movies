const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        index:true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    role:{
        type: String
    }
});



const User = module.exports = mongoose.model('User', UserSchema);


const u = new User({username : 'admin', password : 'admin',email:'nikola.filip97@gmail.com',role : 'admin' });

module.exports.createUser = (newUser, callback) =>{
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;

            newUser.save(callback);
        });
    });
}

module.exports.findByUsername = (username, callback)  => {
    const query = {username : username};
    User.findOne(query, callback);
};

module.exports.getById = (id, callback)  => {
    User.findById(id, callback);
};

module.exports.comparePasswords = ( passedPassword, dbPassword, callback) => {
    // Load hash from your password DB.
    const hash = dbPassword;
    bcrypt.compare(passedPassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
};

/*
For clearing db
User.remove({}, function(){
	console.log('All users removed');
});
*/

// Insert admin by default
User.findByUsername('admin',(err, user) => {
    if(err) throw err;
    if(!user) {
        User.createUser(u,(err, user) => {
            if(err) throw err;
            console.log(user);
        });
    }else{
        console.log('Admin already exsists');
    }
});
