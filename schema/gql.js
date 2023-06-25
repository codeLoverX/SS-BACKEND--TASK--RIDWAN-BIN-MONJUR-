const { gql } = require('apollo-server-express');

exports.typeDefs = gql`

type Movie {
    _id: ID
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

"""Update Movie input type."""
input UpdateMovieInput {
    _id: ID!
    name: String
    type: String
    runtime: Int
}

type User {
    _id: ID!
    name: String
    email: String
    role: String
}

type Token {
  token: String
}

"""Add User input type."""
input AddUserInput {
    name: String!
    email: String!
    password: String!
    confirmPassword: String!
    role: String!
}

"""Login User input type."""
input LoginUserInput {
    email: String!
    password: String!
}

type Mutation {
    updateMovie(patch: UpdateMovieInput): Movie
    addMovie(patch: AddMovieInput): Movie
    deleteMovie(id: ID): Boolean!
    login(patch: LoginUserInput): Token!
    register(patch: AddUserInput!): User!
} `
