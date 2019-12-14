const express = require('express')
const graphqlHTTP = require('express-graphql')
const schema = require('./schema')
//const logger = require('morgan')
const port = 4000
const app = express()

app
    //.use(logger("dev"))
    .use('/graphql', graphqlHTTP({
        schema: schema,
        graphiql: true,
    }))


    .listen(port, function () {
        console.log(`server running on port${port}`)
        console.log(`GraphQL server running on http://localhost:${port}/graphql`)
    })

