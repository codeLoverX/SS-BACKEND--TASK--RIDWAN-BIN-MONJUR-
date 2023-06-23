const { gql } = require('apollo-server-express');

exports.typeDefs = gql `

type Movie {
    id: ID
    name: String
    type: String
    runtime: Int!
}

type Query {
    getMoviesList: [Movie]
    getMovie(id: ID!): Movie
}

"""Add Movie input type."""
input AddMovieInput {
    name: String
    type: String
    runtime: Int
}

"""Add Movie input type."""
input UpdateMovieInput {
    name: String!
    type: String!
    runtime: Int!
}

type Mutation {
    updateMovie(patch: UpdateMovieInput): Movie
    addMovie(patch: AddMovieInput): Movie
    deleteMovie(id: ID): Boolean!
} `
