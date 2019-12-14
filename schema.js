const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLList
} = require('graphql')

const db = require('./dbconexion')

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
        id_faculty: { type: new GraphQLNonNull(GraphQLID) },
        faculty: { type: new GraphQLNonNull(GraphQLString) }
    }
})

const Student = new GraphQLObjectType({
    name: 'Student',
    fields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        firts_name: { type: new GraphQLNonNull(GraphQLString) },
        last_name: { type: new GraphQLNonNull(GraphQLString) },
        sex: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: new GraphQLNonNull(GraphQLString) },
        school: { type: new GraphQLNonNull(GraphQLID) },
        ubigeo: { type: new GraphQLNonNull(GraphQLString) },
        address: { type: new GraphQLNonNull(GraphQLString) },
        status: { type: new GraphQLNonNull(GraphQLBoolean) }
    }
})

// query
const query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        faculties: {
            type: new GraphQLList(Faculty),
            resolve: () => {
                const query = 'select * from faculty'
                return db.manyOrNone(query)
                    .then(data => data)
                    .catch(error => error)
            }
        },

        schools: {
            type: new GraphQLList(School),
            resolve: () => {
                const query = `
                    select 
                    s.id,
                    s.school,
                    f.id as id_faculty,
                    f.faculty as faculty
                    from faculty as f 
                    inner join school as s 
                    on f.id = s.id_faculty
                `
                return db.manyOrNone(query)
                    .then(data => data)
                    .catch(error => error)
            }
        },

        schoolsByIdFaculty: {
            type: new GraphQLList(School),
            args: {
                idFaculty: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: (_, args) => {
                const query = `
                    select 
                    s.id,
                    s.school,
                    f.id as id_faculty,
                    f.faculty as faculty
                    from faculty as f 
                    inner join school as s 
                    on f.id = s.id_faculty
                    where s.id_faculty=$1
                `
                return db.manyOrNone(query, [args.idFaculty])
                    .then(data => data)
                    .catch(error => error)
            }
        },

        students: {
            type: new GraphQLList(Student),
            resolve: () => {
                const query = 'select * from student'
                return db.manyOrNone(query)
                    .then(data => data)
                    .catch(error => error)
            }
        }
    }
})

// mutation
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addStudent: {
            type: Student,
            args: {
                firts_name: { type: new GraphQLNonNull(GraphQLString) },
                last_name: { type: new GraphQLNonNull(GraphQLString) },
                sex: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                phone: { type: new GraphQLNonNull(GraphQLString) },
                id_school: { type: new GraphQLNonNull(GraphQLID) },
                ubigeo: { type: new GraphQLNonNull(GraphQLString) },
                address: { type: new GraphQLNonNull(GraphQLString) },
                status: { type: new GraphQLNonNull(GraphQLBoolean) }
            },
            resolve: (_, args) => {
                const query = `
                    insert into student
                    (firts_name,last_name,sex,email,phone,id_school,ubigeo,address,status)
                    values ($1,$2,$3,$4,$5,$6,$7,$8,$9)
                    returning
                    firts_name,
                    last_name,
                    sex,
                    email,
                    phone,
                    (select school from school where id = $6) as school
                    ubigeo,
                    address,
                    status
                `;
                return db.one(query, [args.firts_name, args.last_name, args.sex, args.email, args.phone, args.id_school, args.id_school, args.ubigeo, args.addStudent, args.status])
                    .then(data => data)
                    .catch(error => error);
            }
        }

    }
})

module.exports = new GraphQLSchema({ query, mutation })