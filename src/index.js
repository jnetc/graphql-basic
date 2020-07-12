import { GraphQLServer, PubSub } from 'graphql-yoga';
import db from './db'
// Import resolvers
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription'
import User from './resolvers/User'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'

const pubsub = new PubSub()

// Server Yoga settings
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment
  },
  context: {
    db,
    pubsub
  }
});


server.start(() => {
  console.log(' The server is up! ');
});

// import express from 'express'
// import chalk from 'chalk'

// const app = express()

// app.use(express.urlencoded({ extended: true }))
// app.use(express.json())

// const PORT = process.env.PORT || 3000
// app.listen(PORT, () => console.log(chalk.inverse.green(' Server running ')))
