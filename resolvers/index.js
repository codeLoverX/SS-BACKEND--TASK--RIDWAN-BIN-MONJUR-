const { movie } = require("./Movie");
const { user } = require("./User");

const { Query: QueryMovie, Mutation: MutationMovie, ...restMovie } = movie;
const { Query: QueryUser, Mutation: MutationUser, ...restUser } = user;
console.log(restMovie)
module.exports = {
    resolvers: {
        ...restMovie,
        Query: {
            ...QueryMovie, ...QueryUser
        },
        Mutation: {
            ...MutationUser, ...MutationMovie
        }
    }
}