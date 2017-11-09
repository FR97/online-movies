const mongoose = require('mongoose');


// User Schema
const MovieSchema = mongoose.Schema({
    title: {
        type: String,
        required : true
    },
    year: {
        type     : Number,
        required : true,
        validate : {
            validator : Number.isInteger,
            message   : '{VALUE} is not a valid year'
        }
    },
    genres:{
        type:[{
                type: String,
                enum: ['Action', 'Animation', 'Comedy', 'Crime', 'Drama', 'Horror', 'History', 'Fantasy', 'Thriller', 'Sci-Fi', 'War']
            }],
        required: true
    },
    url: {
        type     : String,
        required : true
    },
    description:{
        type: String
    },
    imdbRating:{
        type: Number,
        default: 0
    },
    rating:{
        type: Number,
        default: 0
    },
    views:{
        type: Number,
        default: 0,
        validate : {
            validator : Number.isInteger,
            message   : '{VALUE} is not a valid year'
        }
    },
    imgPath:{
        type: String,
        required: true
    }
});

const Movie = module.exports = mongoose.model('Movie', MovieSchema);

const movie1 = new Movie({title: 'It', year: 2017, genres:['Drama','Horror', 'Thriller'],
    url: 'http://cdn.vintmedia3.stream/videos/5a03aee66057510c1acef368.mp4', description:'Clown that kills people!',imdbRating: 7.8, imgPath: 'm-it.jpg'});
const movie2 = new Movie({title: 'Dunkirk', year: 2017, genres:['Action','History','War'],
    url: 'http://cdn.vintmedia2.stream/videos/5a0354c5beaea90e75d9107d.mp4',imdbRating: 8.3, imgPath: 'm-dunkirk.jpg'});

const movie3 = new Movie({title: 'Dunkirk', year: 2017, genres:['Action','History','War'],
    url: 'http://cdn.vintmedia2.stream/videos/5a0354c5beaea90e75d9107d.mp4',imdbRating: 8.3, imgPath: 'm-dunkirk.jpg'});

module.exports.addMovie = (movie, callback) =>{
    movie.save(callback);
};


Movie.remove({}, function(){
    console.log('All movies removed');
});
Movie.addMovie(movie1,(err, movie) => {
    if(err) throw err;
    console.log(movie);
});
Movie.addMovie(movie2,(err, movie) => {
    if(err) throw err;
    console.log(movie);
});

Movie.addMovie(movie3,(err, movie) => {
    if(err) throw err;
    console.log(movie);
});

