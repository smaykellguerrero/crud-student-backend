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

const Alumno = new GraphQLObjectType({
    name: 'Alumno',
    fields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        nombre: { type: new GraphQLNonNull(GraphQLString) },
        carrera: { type: new GraphQLNonNull(GraphQLString) }
    }
});

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
        alumnos: {
            type: new GraphQLList(Alumno),
            resolve: () => {
                const query = `
                    select
                    a.id,
                    a.nombre,
                    c.nombre as carrera
                    from tb_alumno as a
                    inner join tb_carrera as c
                    on a.id_carrera = c.id
                `;
                return db.manyOrNone(query)
                    .then(data => data)
                    .catch(error => error);
            }
        },
    
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
        agregarAlumno: {
            type: Alumno,
            args: {
                nombre: { type: new GraphQLNonNull(GraphQLString) },
                idCarrera: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (_, args) => {
                const query = `
                    insert into tb_alumno
                    (nombre,id_carrera)
                    values ($1,$2)
                    returning
                    id,
                    nombre, 
                    (select nombre from tb_carrera where id = $2) as carrera
                `;
                return db.one(query, [args.nombre, args.idCarrera])
                    .then(data => data)
                    .catch(error => error);
            }
        },
        actualizarDatosAlumno: {
            type: Alumno,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                nombre: { type: new GraphQLNonNull(GraphQLString) },
                idCarrera: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (_, args) => {
                const query = `
                    update tb_alumno
                    set nombre = $2,
                    id_carrera = $3
                    where id = $1
                    returning
                    id,
                    nombre, 
                    (select nombre from tb_carrera where id = $3) as carrera
                `;
                return db.one(query, [args.id, args.nombre, args.idCarrera])
                    .then(data => data)
                    .catch(error => error);
            }
        },
        eliminarAlumno: {
            type: GraphQLBoolean,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: (_, args) => {
                return db.none('delete from tb_alumno where id = $1', [args.id])
                    .then(() => true)
                    .catch(error => error);
            }
        },
    }
});

module.exports = new GraphQLSchema({ query, mutation });