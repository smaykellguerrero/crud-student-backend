const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLList
} = require('graphql');

const db = require('./dbconexion');

// types
const Faculty = new GraphQLObjectType({
    name: 'Faculty',
    fields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        faculty: { type: new GraphQLNonNull(GraphQLString) }
    }
})

const School = new GraphQLObjectType({
    name: 'School',
    fields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        school: { type: new GraphQLNonNull(GraphQLString) },
        faculty: { type: new GraphQLNonNull(GraphQLString) }
    }
})

// query

const query = new GraphQLObjectType({
    name: 'Query',
    fields: {

        faculties: {
            type: new GraphQLList(Faculty),
            resolve: () => {
                const query = 'select * from faculty';
                return db.manyOrNone(query)
                    .then(data => data)
                    .catch(error => error);
            }
        },

        schools: {
            type: new GraphQLList(School),
            resolve: () => {
                const query = `
                    select 
                    s.id,
                    s.school,
                    f.faculty as faculty
                    from faculty as f 
                    inner join school as s 
                    on f.id = s.id_faculty
                `;
                return db.manyOrNone(query)
                    .then(data => data)
                    .catch(error => error);
            }
        }
    }
});

// mutation

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {

    }
});

module.exports = new GraphQLSchema({ query, mutation });