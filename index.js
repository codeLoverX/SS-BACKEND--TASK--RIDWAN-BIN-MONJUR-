require('dotenv').config();
const express = require('express');
const { validateEnv } = require('./utils/validateEnv');
const { ApolloServer, gql } = require('apollo-server-express');
const { connectDB } = require('./utils/db');
const { seedMovies } = require('./utils/seed');
const { typeDefs } = require('./schema/gql');
const { resolvers } = require('./resolvers/movie');

validateEnv()

async function bootstrap() {
    const server = new ApolloServer({ typeDefs, resolvers });

    connectDB();

    seedMovies();

    await server.start();

    const app = express();
    app.get("/seed", (req, res) => res.json({ hello: true }))

    server.applyMiddleware({ app });

    const port = process.env.PORT;
    app.listen(port, () => {
        console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
    });
}

bootstrap()
    .catch((err) => {
        throw err;
    })



