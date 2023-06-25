const { Movie } = require("../models/Movie");

movie = {
    Query: {
        getMoviesList: async (_parent, args) => {
            const movies = await Movie.find({})
            return movies;
        },
        getMovie: async (_parent, args) => {
            const movie = await Movie.findById(args.id)
            return movie;
        }
    },
    Mutation: {
        updateMovie: async (_parent, args) => {
            const movie = await Movie.findByIdAndUpdate(args.id,
                {
                  ...args.patch
                }, { new: true })
            return movie;
        },
        addMovie: async (_parent, args) => {
            const movie = new Movie({
                ...args.patch
            });
            await movie.save()
            return movie;
        },
        deleteMovie: async (_parent, args) => {
            try {
                await Movie.findOneAndRemove({ _id: args.id });
                return true;
            } catch (error) {
                return false;
            }
        }
    }
}


module.exports = {
    movie
}