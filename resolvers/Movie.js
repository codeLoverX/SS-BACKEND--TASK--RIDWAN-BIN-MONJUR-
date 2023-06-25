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
                    console.log({ movies })
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

        addMovie: async (_parent, args) => {
            let _actorsOutput = []
            let _directorOutput = {}
            let movie = new Movie();
            let {
                actors, director, ...rest
            } = args.patch

            // 1. if actor's id is given, check if it's a correct id and then just add the id.
            // 2. if actor's new details are given and no id is given, 
            //      then actor doesn't exist, use the details to create new actor and new actor's id
            actors = await Promise.all(actors.map(async (value) => {
                let currentActor = null;
                // CONDITION 2: Actor details given. Actor does't exist. .
                if (typeof value.existingActorId === 'undefined' || value.existingActorId === null) {
                    // Make a new actor and save it
                    currentActor = new Actor({
                        name: value.newActorDetails.name, movies: [] // movies: [movie._id] 
                    });
                    await currentActor.save();
                }
                // CONDITION 1: Actor id is given so maybe  actor exists. Let's check
                else {
                    const id = new mongoose.mongo.ObjectId(value.existingActorId);
                    // check if supplied actor id is correct
                    currentActor = await Actor.findById(id).orFail();
                    // currentActor.movies.push(movie);
                }
                // await currentActor.save();
                _actorsOutput.push(currentActor)
                return currentActor._id
            }))
            // 1. if director's id is given, check if it's a correct id and then just add the id.
            // 2. if director's new details are given and no id is given, 
            //      then director doesn't exist, use the details to create new director and add new actor's id
            if (typeof director.existingActorId === 'undefined' || director.existingActorId === null) {
                // CONDITION 2: director details given. Actor does't exist. .
                _directorOutput = new Director({ name: director.newDirectorDetails.name, movies: [movie._id] });
                await _directorOutput.save();
            }
            else {
                // CONDITION 1: Director id is given so maybe  director exists. Let's check
                const id = new mongoose.mongo.ObjectId(director.existingDirectorId);
                // check if supplied DIRECTOR id is correct
                _directorOutput = await Director.findById(id).orFail();
                // _directorOutput.movies.push(movie);
            }
            director = _directorOutput._id;

            movie = new Movie({
                actors, director, ...rest
            });
            await movie.save()
            movie.actors = _actorsOutput;
            movie.director = _directorOutput;
            return movie;
        },
        updateMovie: async (_parent, args) => {
            let {
                actors, director, ...rest
            } = args.patch
            let _actorsOutput = []
            let _directorOutput = {}
            try {
                const id = new mongoose.mongo.ObjectId(args.patch._id);
                await Movie.findById(id).orFail();
                if (typeof actors !== 'undefined' && actors !== null) {
                    let length = actors.length;
                    let currentActor = {}
                    // The POST request array of actors must be added if they don't exists
                    for (let index= 0 ; index <length; index++) {
                        currentActor = actors [index];
                        if (typeof currentActor.existingActorId === 'undefined' || currentActor.existingActorId === null) {
                            currentActor = new Actor({
                                name: currentActor.newActorDetails.name, movies: [], // movies: [oldMovie._id] 
                            });
                            await currentActor.save();
                        }
                        else {
                            const actorId = new mongoose.mongo.ObjectId(currentActor.existingActorId);
                            currentActor = await Actor.findById(actorId).orFail();
                        }
                        actors[index] = currentActor._id;
                        _actorsOutput.push(currentActor)
                    }
                }

                if (typeof director !== 'undefined' && director !== null) {
                    _directorOutput = { _id : director._id, name: director.name };
                    if (typeof director.existingDirectorId === 'undefined' || director.existingDirectorId === null) {
                        director = new Director({
                            name: director.newDirectorDetails.name, movies: [] //  movies: [oldMovie._id]], 
                        });
                        await director.save();
                    }
                    else {
                        const directorId = new mongoose.mongo.ObjectId(director.existingDirectorId);
                        director = await Director.findById(directorId).orFail();
                    }
                    director = director._id;
                } 

                // console.log({rest, actors, director, _directorOutput})
                const movie = await Movie.findByIdAndUpdate(id,
                    {
                        ...rest,
                        actors,
                        director
                    }, { new: true }).orFail()
                    
                movie.actors = _actorsOutput;
                movie.director = { id: _directorOutput._id, name: _directorOutput.name };
                return movie;

            }
            catch (error) {
                throw new Error(error);
            }
        },
        deleteMovie: async (_parent, args) => {
            try {
                const id = new mongoose.mongo.ObjectId(args._id);
                await Movie.findById(id).orFail();
                await Movie.deleteOne({ _id: args._id });
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