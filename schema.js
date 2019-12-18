const { GraphQLSchema, GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull, GraphQLBoolean, GraphQLList } = require('graphql')

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
        idFaculty: { type: new GraphQLNonNull(GraphQLID) },
        faculty: { type: new GraphQLNonNull(GraphQLString) }
    }
})

const Student = new GraphQLObjectType({
    name: 'Student',
    fields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        sex: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: new GraphQLNonNull(GraphQLString) },
        idSchool: { type: new GraphQLNonNull(GraphQLID) },
        school: { type: new GraphQLNonNull(GraphQLString) },
        ubigeo: { type: new GraphQLNonNull(GraphQLString) },
        address: { type: new GraphQLNonNull(GraphQLString) },
        status: { type: new GraphQLNonNull(GraphQLBoolean) }
    }
})

// query
const query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        facultiesAll: {
            type: new GraphQLList(Faculty),
            resolve: () => {
                const query = 'select * from faculty'
                return db.manyOrNone(query)
                    .then(data => data)
                    .catch(error => error)
            }
        },

        schoolsAll: {
            type: new GraphQLList(School),
            resolve: () => {
                const query = `
                    select 
                    s.id,
                    s.school,
                    f.id as "idFaculty",
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
                    f.id as "idFaculty",
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

        studentsAll: {
            type: new GraphQLList(Student),
            resolve: () => {
                const query = `
                    select
                    s.id,
                    s.first_name as "firstName",
                    s.last_name as "lastName",
                    s.sex,
                    s.email,
                    s.phone,
                    s.id_school as "idSchool",
                    (select school from school where id=s.id_school) as school,
                    s.ubigeo,
                    s.address,
                    s.status
                    from student as s
                `
                return db.manyOrNone(query)
                    .then(data => data)
                    .catch(error => error)
            }
        },
        StudentById: {
            type: Student,
            args: {
                idStudent: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: (_, args) => {
                const query = ` 
                    select
                    s.id,
                    s.first_name as "firstName",
                    s.last_name as "lastName",
                    s.sex,
                    s.email,
                    s.phone,
                    s.id_school as "idSchool",
                    (select school from school where id=s.id_school) as school,
                    s.ubigeo,
                    s.address,
                    s.status
                    from student as s
                    where s.id=$1
                `
                return db.oneOrNone(query, [args.idStudent])
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
        insertStudent: {
            type: Student,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                lastName: { type: new GraphQLNonNull(GraphQLString) },
                sex: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                phone: { type: new GraphQLNonNull(GraphQLString) },
                idSchool: { type: new GraphQLNonNull(GraphQLID) },
                ubigeo: { type: new GraphQLNonNull(GraphQLString) },
                address: { type: new GraphQLNonNull(GraphQLString) },
                status: { type: new GraphQLNonNull(GraphQLBoolean) }
            },
            resolve: (_, args) => {
                const query = `
                    insert into student
                    (first_name,last_name,sex,email,phone,id_school,ubigeo,address,status)
                    values ($1,$2,$3,$4,$5,$6,$7,$8,$9)
                    returning
                    first_name as "firstName",
                    last_name as "lastName",
                    sex,
                    email,
                    phone,
                    id_school as "idSchool",
                    (select school from school where id = $6) as school,
                    ubigeo,
                    address,
                    status
                `;
                return db.one(query, [args.firstName, args.lastName, args.sex, args.email, args.phone, args.idSchool, args.ubigeo, args.address, args.status])
                    .then(data => data)
                    .catch(error => error);
            }
        },

        updateStudent: {
            type: Student,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                lastName: { type: new GraphQLNonNull(GraphQLString) },
                sex: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                phone: { type: new GraphQLNonNull(GraphQLString) },
                idSchool: { type: new GraphQLNonNull(GraphQLID) },
                ubigeo: { type: new GraphQLNonNull(GraphQLString) },
                address: { type: new GraphQLNonNull(GraphQLString) },
                status: { type: new GraphQLNonNull(GraphQLBoolean) },
                id: {type: new GraphQLNonNull(GraphQLID)}

            },
            resolve: (_, args) => {
                const query = `
                    update student
                    set
                    first_name=$1,
                    last_name=$2,
                    sex=$3,
                    email=$4,
                    phone=$5,
                    id_school=$6,
                    ubigeo=$7,
                    address=$8,
                    status=$9
                    where id=$10
                    returning
                    first_name as "firstName",
                    last_name as "lastName",
                    sex,
                    email,
                    phone,
                    id_school as "idSchool",
                    (select school from school where id = $6) as school,
                    ubigeo,
                    address,
                    status
                `;
                return db.one(query, [args.firstName, args.lastName, args.sex, args.email, args.phone, args.idSchool, args.ubigeo, args.address, args.status,ars.id])
                    .then(data => data)
                    .catch(error => error);
            }
        },

        deleteStudent: {
            type: GraphQLBoolean,
            args: {
                idStudent: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: (_, args) => {
                const query = `delete from student where id = $1`
                return db.none(query, [args.idStudent])
                    .then(() => true)
                    .catch(error => error);
            }
        }
    }
})

module.exports = new GraphQLSchema({ query, mutation })