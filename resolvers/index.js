const { movie } = require("./Movie");
const { user } = require("./User");

module.exports = {
    resolvers: {
        Query: {
            ...movie.Query, ...user.Query
        },
        Mutation: {
            ...movie.Mutation, ...user.Mutation
        }
    }
}