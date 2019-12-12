const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema');
const puerto = 4000;

const app = express();

app.use((req, res, next) => {
    res.set({
        "Access-Control-Allow-Origin": "http://localhost:3000",
        'Access-Control-Allow-Credentials': 'true'
    });
    if (req.method === "OPTIONS") {
        res.set({ "Access-Control-Allow-Headers": "Content-Type" });
        return res.end();
    }
    next();
});

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

app.listen(puerto, function () {
    console.log(`Servidor corriendo en el puerto ${puerto}`);
    console.log(`Servidor GraphQL corriendo en http://localhost:${puerto}/graphql`);
});


