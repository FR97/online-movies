const express = require('express');
const router = express.Router();
const passport = require('passport');
const Movie = require('../models/movie');

router.get('/', (req, res) =>{

    Movie.find({}, (err, movies) => {
        let allMovies =[];
        movies.forEach((movie) => {
           allMovies.push(movie);
        })
        res.render('movies',{page: 'movies', movies:allMovies});
    });


});


router.get('/favorites',(req, res) =>{
    if(res.locals.user){

        res.render('favorites');

    }
    else{
        req.flash('error_msg','You must be logged in other to see your favorite movies!');
        res.redirect('/users/login');
    }
});


router.get('/watch/:id', (req, res) =>{

    Movie.findById(req.params.id,(err, movie)=>{

        if(err) throw err;

        if(movie === undefined){
            req.flash('error_msg',"Can't find requested movie!");
            res.redirect('/movies/');
        }
        res.render('movie',{page: 'movies', movie:movie});

    });


});

router.post('/', (req, res)=>{


});









module.exports = router;