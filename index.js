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
const { getUser } = require("./utils/getUser")
const cookies = require("cookie-parser");

async function bootstrap() {
    validateEnv();
    const pathName = path.join(__dirname, "./.env")
    dotenv.config({ pathName });
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req, res }) => {
            const user = getUser(req);
            console.log('AUTHORIZE USER', user);
            return {
                user,
                req,
                res,
            };
        },
    });
    connectDB();
    seedMovies();
    await server.start();
    const app = express();
    app.use(cookies());
    server.applyMiddleware({ app });
    app.use((error, _, __, next) => { console.log({ error }); next(); })
    const port = process.env.PORT;
    app.listen(port, () => console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`));
}

bootstrap()
    .catch((err) => {
        throw err;
    })



