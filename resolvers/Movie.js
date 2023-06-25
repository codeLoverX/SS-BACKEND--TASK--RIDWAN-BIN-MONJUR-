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
        updateMovie: async (_parent, args) => {
            let {
                actors, director, ...rest
            } = args.patch
            // 
            try {
                const oldMovie = await Movie.findById(args._id);
                if (typeof oldMovie === 'undefined' || oldMovie === null) {
                    throw new UserInputError("Movie doesn't exist by id " + args._id)
                }
                if (typeof actors !== 'undefined' && actors !== null) {
                    // The POST request array of actors must be added if they don't exists
                    for (let currentActor of actors) {
                        if (typeof currentActor.existingActorId === 'undefined' && currentActor.existingActorId === null) {
                            currentActor = new Actor({ name: value.newActorDetails.name, movies: [oldMovie._id] });
                            await currentActor.save();
                        }
                        else {
                            if (!oldMovie.actors.includes(currentActor.existingActorId)) {
                                currentActor = await Actor.findByIdAndUpdate(
                                    new mongoose.mongo.ObjectId(currentActor.existingActorId),
                                    {
                                        $push: {
                                            movies: args._id
                                        }
                                    },
                                    { new: true }
                                )
                            }
                        }
                        currentActor = currentActor._id;
                    }
                    console.log({ actors })
                    for (let currentOldActor of oldMovie.actors) {
                        if (!oldMovie.actors.includes(currentOldActor.actors.map(value))) {
                            currentActor = await Actor.findByIdAndUpdate(
                                new mongoose.mongo.ObjectId(currentActor.existingActorId),
                                {
                                    $pullAll: {
                                        movies: args._id
                                    }
                                },
                                { new: true }
                            )
                        }
                    }

                    console.log({ actors })
                }
                if (typeof director !== 'undefined' && director !== null) {
                    if (typeof director.existingDirectorId === 'undefined' && director.existingDirectorId === null) {
                        director = new Director({ name: value.newDirectorDetails.name, movies: [oldMovie._id] });
                        await director.save();
                    }
                    else {
                        console.log({ old: typeof oldMovie.director, new: director.existingDirectorId })
                        if (!oldMovie.director == director.existingDirectorId) {
                            director = await Director.findByIdAndUpdate(
                                director.existingDirectorId,
                                {
                                    $push: {
                                        movies: args._id
                                    }
                                },
                                { new: true }
                            )
                        }
                    }
                    director = director._id
                    console.log({ old: typeof oldMovie.director, new: director.existingDirectorId })
                    if (!oldMovie.director == director.existingDirectorId) {
                        director = await Director.findByIdAndUpdate(
                            new mongoose.mongo.ObjectId(oldMovie.director),
                            {
                                $pullAll: {
                                    movies: args._id
                                }
                            },
                            { new: true }
                        )
                    }
                }
                // oldMovie actors not present in the current POST request must be deleted
                console.log({ director })
                const movie = await Movie.findByIdAndUpdate(args._id,
                    {
                        ...rest,
                        actors,
                        director
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
            let {
                actors, director, ...rest
            } = args.patch
            actors = await Promise.all(actors.map(async (value) => {
                let currentActor = null;
                if (typeof value.existingActorId === 'undefined' || value.existingActorId === null) {
                    currentActor = new Actor({ name: value.newActorDetails.name, movies: [movie._id] });
                }
                else {
                    const id = new mongoose.mongo.ObjectId(value.existingActorId);
                    currentActor = await Actor.findById(id);
                    if (typeof currentActor === 'undefined' || currentActor === null) {
                        throw new UserInputError("Actor doesn't exist by id " + value.existingActorId)
                    }
                    currentActor.movies.push(movie);
                }
                await currentActor.save();
                _actorsOutput.push(currentActor)
                return currentActor._id
            }))

            if (typeof director.existingActorId === 'undefined' || director.existingActorId === null) {
                _directorOutput = new Director({ name: director.newDirectorDetails.name, movies: [movie._id] });
                await _directorOutput.save();
            }
            else {
                const id = new mongoose.mongo.ObjectId(director.existingDirectorId);
                console.log({ id });
                _directorOutput = await Director.findById(id);
                if (typeof _directorOutput === 'undefined' || _directorOutput === null) {
                    throw new UserInputError("Director doesn't exist by id " + director.existingDirectorId)
                }
                _directorOutput.movies.push(movie);
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
        deleteMovie: async (_parent, args) => {
            try {
                const id = new mongoose.mongo.ObjectId(args._id);
                const movie = await Movie.findById(id);
                console.log({movie: movie.director})
                if (typeof movie !== 'undefined' && movie !== null) {
                    let [actor, director] = await Promise.all([
                        Actor.findOne(
                            { _id: { $in: movie.actors } }),
                        ,
                        Director.findOne(
                            { _id: movie.director }
                        )
                    ])
                 
                    console.log({ actor, director })
                    actor.movies = actor.movies.filter((value) => {
                        console.log({ type1: typeof value, type2: typeof movie._id })
                        const isNotRemoved = value !== movie._id
                        if (!isNotRemoved) {
                            console.log({ value, id: movie._id })
                        }
                        return isNotRemoved
                    })
                    if (director?.movies == null){
                        director.movies = []
                    }
                    director.movies = director.movies.filter((value) => {
                        console.log({ type1: typeof value, type2: typeof movie._id })
                        const isNotRemoved = value !== movie._id
                        if (!isNotRemoved) {
                            console.log({ value, id: movie._id })
                        }
                        return isNotRemoved
                    })
                    await Promise.all([
                        async () => { await director.save(); },
                        async () => { await user.save(); },
                        async () => { await Movie.deleteOne({ _id: args._id }); }
                    ])
                }
                else {
                    throw new UserInputError("Movie doesn't exist by id" + args._id)
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