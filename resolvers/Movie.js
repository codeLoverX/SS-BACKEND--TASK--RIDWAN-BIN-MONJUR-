const { Actor } = require("../models/Actor");
const { Director } = require("../models/Director");
const { Movie } = require("../models/Movie");
const { UserInputError } = require("apollo-server-express");
const graphqlFields = require("graphql-fields");
const mongoose = require('mongoose');

movie = {
    MovieOutput: {
        __resolveType(_, context) {
            const { user } = context;
            if (typeof user === 'undefined' || user === null) {
                return 'GuestUserMovie'
            }
            else return "Movie"; // GraphQLError is thrown
        },
    },
    Query: {
        getMoviesList: async (_parent, _args, context, info) => {
            try {
                const { user } = context;
                if (typeof user === 'undefined' || user === null) {
                    const movies = await Movie.find({}).lean()
                    console.log({movies})
                    return movies;
                }
                    console.log({ user });
                    const topLevelFields = Object.keys(graphqlFields(info));
                    return await Movie.find({}).select(topLevelFields).populate("actors").populate("director");
               
            }
            catch (error) {
                throw new Error(error);
            }
        },
        getMovie: async (_parent, args) => {
            const movie = await Movie.findById(args._id).lean().populate("actors").populate("director");
            return movie;
        }
    },
    Mutation: {
        updateMovie: async (_parent, args) => {
            try {
                const movie = await Movie.findByIdAndUpdate(args._id,
                    {
                        ...args.patch
                    }, { new: true })
                return movie;
            }
            catch (error) {
                throw new Error(error);
            }
        },
        addMovie: async (_parent, args) => {
            let _actorsOutput = []
            let _directorOutput = {}
            let movie = new Movie();
            const {
                actors, director, ...rest
            } = args.patch
            actors = await Promise.all(actors.map(async (value) => {
                let currentActor = null;
                if (typeof value.existingActorId === 'undefined' || value.existingActorId === null) {
                    currentActor = new Actor({ name: value.newActorDetails.name, movies: [movie._id] });
                    await currentActor.save();
                }
                else {
                    const id = new mongoose.mongo.ObjectId(value.existingActorId);
                    console.log({ id });
                    currentActor = await Actor.findById(id);
                    if (typeof currentActor === 'undefined' || currentActor === null) {
                        throw new UserInputError("Actor doesn't exist by id" + value.existingActorId)
                    }
                    currentActor.movies.push(movie);
                    await currentActor.save();
                }
                _actorsOutput.push(currentActor)
                return currentActor._id
            }))

            if (director.existingActorId === true) {
                _directorOutput = new Director({ name: director.newDirectorDetails.name, movies: [movie._id] });
                await _directorOutput.save();
            }
            else {
                const id = new mongoose.mongo.ObjectId(director.existingDirectorId);
                console.log({ id });
                _directorOutput = await Director.findById(id);
                if (typeof _directorOutput === 'undefined' || _directorOutput === null) {
                    throw new UserInputError("Actor doesn't exist by id" + director.existingDirectorId)
                }
                _directorOutput.movies.push(movie);
            }
            director = _directorOutput._id;

            movie = new Movie({
                actor, director, ...rest
            });
            await movie.save()
            movie.actors = _actorsOutput;
            movie.director = _directorOutput;
            return movie;
        },
        deleteMovie: async (_parent, args) => {
            try {
                const id = new mongoose.mongo.ObjectId(args._id);
                const movie = await Movie.findById(id);
                if (typeof movie !== 'undefined' && movie !== null) {
                    await Actor.updateMany(
                        { _id: { $in: movie.actors } },
                        { $pull: { movies: movie._id } }
                    )
                    await Director.updateMany(
                        { _id: { $in: movie.directors } },
                        { $pull: { movies: movie._id } }
                    )
                    await Movie.deleteOne({ _id: args._id });
                }
                else {
                    throw new UserInputError("MOvie doesn't exist by id" + args._id)
                }
                return true;
            } catch (error) {
                throw new Error(error);
            }
        }
    }
}


module.exports = {
    movie
}