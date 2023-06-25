require('dotenv').config();
const express = require('express');
const { validateEnv } = require('./utils/validateEnv');
const { ApolloServer } = require('apollo-server-express');
const { connectDB } = require('./utils/db');
const { seedMovies } = require('./utils/seed');
const { typeDefs } = require('./schema/gql');
const { resolvers } = require("./resolvers")
const dotenv = require("dotenv");
const path = require('path');

async function bootstrap() {
    validateEnv();
    const pathName = path.join(__dirname, "./.env")
    dotenv.config({ pathName });
    const server = new ApolloServer({ typeDefs, resolvers });
    connectDB();
    seedMovies();
    await server.start();
    const app = express();
    server.applyMiddleware({ app });
    const port = process.env.PORT;
    app.listen(port, () => console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`));
}

bootstrap()
    .catch((err) => {
        throw err;
    })



