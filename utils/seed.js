const { Movie } = require("../models/Movie");
const { MovieGenreEnum } = require("../resolvers/enum");

const moviesList = [
    new Movie({
        name: "FAST X",
        type: MovieGenreEnum.ACTION,
        runtime: 143,
    }),
    new Movie({
        name: "FAST & FURIOUS 6",
        type: MovieGenreEnum.ACTION,
        runtime: 143,
    }),
    new Movie({
        name: "MAD MAX",
        type: MovieGenreEnum.ACTION,
        runtime: 143,
    }),
    new Movie({
        name: "PIRATES OF CARIBBEAN",
        type: MovieGenreEnum.ACTION,
        runtime: 143,
    }),
];

exports.seedMovies = async () => {
    const count = await Movie.countDocuments();
    if (count <= 3) {
        await Movie.deleteMany();
        await Movie.create(moviesList);
        console.info("Seeded (🌱) the data ")
    }
}