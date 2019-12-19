const express = require('express')
const graphqlHTTP = require('express-graphql')
const schema = require('./schema')
//const logger = require('morgan')
const port = 4000
const app = express()

app
    //.use(logger("dev"))
    .use((req, res, next) => {
        res.set({
            "Access-Control-Allow-Origin": "http://localhost:3000",
            'Access-Control-Allow-Credentials': 'true'
        })
        if (req.method === "OPTIONS") {
            res.set({ "Access-Control-Allow-Headers": "Content-Type" })
            return res.end()
        }
        next()
    })

    .use('/graphql', graphqlHTTP({
        schema: schema,
        pretty: true,
        graphiql: true
    }))

    .listen(port, function () {
        console.log(`server running on port ${port}`)
        console.log(`GraphQL server running on http://localhost:${port}/graphql`)
    })

