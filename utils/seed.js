const { Director } = require("../models/Director");
const { Actor } = require("../models/Actor");
const { Movie } = require("../models/Movie");
const { MovieGenreEnum } = require("../utils/enum");

let directorsList = [
    new Director({
        name: "James Cameron",
        movies: []
    }),
    new Director({
        name: "John Doe",
        movies: []
    }),
    new Director({
        name: "Chris Nolan",
        movies: []
    }),
    new Director({
        name: "Martin ScoreSomething",
        movies: []
    })
];

let actorsList = [
    new Actor({
        name: "Leanardo",
        movies: []
    }),
    new Actor({
        name: "Kate",
        movies: []
    }),
    new Actor({
        name: "Tom",
        movies: []
    }),
    new Actor({
        name: "Zendaya",
        movies: []
    })
];

let moviesList = [
    new Movie({
        name: "FAST X",
        type: MovieGenreEnum.ACTION,
        runtime: 143,
        year: 2023
    }),
    new Movie({
        name: "FAST & FURIOUS 6",
        type: MovieGenreEnum.ACTION,
        runtime: 143,
        year: 2016
    }),
    new Movie({
        name: "MAD MAX",
        type: MovieGenreEnum.ACTION,
        runtime: 143,
        year: 2012
    }),
    new Movie({
        name: "PIRATES OF CARIBBEAN",
        type: MovieGenreEnum.ACTION,
        runtime: 143,
        year: 2002
    }),
];

exports.seedMovies = async () => {
    const count = await Movie.countDocuments();
    if (count <= 3) {
        await Director.deleteMany();
        directorsList = await Director.create(directorsList);
        await Actor.deleteMany();
        actorsList = await Actor.create(actorsList);
        await Movie.deleteMany();
        moviesList.forEach((value, index) => {
            value.actors = [actorsList[index]._id, actorsList[(index + 1) % 4]._id]
            value.director = directorsList[index]._id
        })
        await Movie.create(moviesList);
        directorsList.forEach(async (value, index) => {
            value.movies = [ moviesList[index]._id ]
            await value.save();
        })
        actorsList.forEach(async (value, index) => {
            value.movies = [ moviesList[lesserThanOne(index)]._id,  moviesList[index]._id ]
            await value.save();
        })
        console.info("Seeded (🌱) the data ")
    }
}

function lesserThanOne(number){
    return number < 0 ? number+4 : number
}