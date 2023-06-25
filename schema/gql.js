const { gql } = require('apollo-server-express');

exports.typeDefs = gql`

interface MovieBasics {
    _id: ID
    name: String
}

type Movie implements MovieBasics {
    _id: ID
    name: String
    type: String
    runtime: Int
    actors: [Actor]
    director: Director
}

type GuestUserMovie implements MovieBasics {
    _id: ID
    name: String
}

union MovieOutput = Movie | GuestUserMovie

type Actor {
    _id: ID
    name: String
    movies: [Movie]
}

type Director {
    _id: ID
    name: String
    movies: [Movie]
}

"""Add Movie input type."""
input AddMovieInput {
    name: String !
    type: String !
    runtime: Int !
    year: Int !
    actors: [AddActor] !
    director: AddDirector !
}

input AddActor {
    newActorDetails: AddNewActorDetails
    existingActorId: ID
}

input AddDirector {
    newDirectorDetails: AddNewDirectorDetails
    existingDirectorId: ID
}

input AddNewActorDetails {
    name: String
}

input AddNewDirectorDetails {
    name: String
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

type Query {
    getMoviesList: [MovieOutput]
    getMovie(_id: ID!): Movie
}

type Mutation {
    updateMovie(patch: UpdateMovieInput): Movie
    addMovie(patch: AddMovieInput): Movie
    deleteMovie(_id: ID): Boolean!
    login(patch: LoginUserInput): Token!
    register(patch: AddUserInput!): User!
} `
