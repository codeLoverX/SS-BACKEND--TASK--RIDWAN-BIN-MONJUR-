require('dotenv').config();
const express = require('express');
const { validateEnv } = require('./utils/validateEnv');
const { PrismaClient } = require('@prisma/client');
const { ApolloServer, gql } = require('apollo-server-express');

validateEnv()

const prisma = new PrismaClient();

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
    Query: {
        hello: () => 'Hello world!',
    },
};


async function bootstrap() {
    const server = new ApolloServer({ typeDefs, resolvers });

    await server.start();

    const app = express();
    app.get("/seed", (req, res)=> res.json({hello: true}))

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
    .finally(async () => {
        await prisma.$disconnect();
    });


