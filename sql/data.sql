create table faculty
(
    id serial primary key,
    faculty varchar not null
);

create table school
(
    id serial primary key,
    school varchar not null,
    id_faculty integer references faculty(id)
);

insert into faculty
    (id,faculty)
values
    (1, 'Agronomía'),
    (2, 'Arquitectura y Urbanismo'),
    (3, 'Ciencias'),
    (4, 'Ciencias Administrativas'),
    (5, 'Ciencias Contables y Financieras'),
    (6, 'Ciencias Sociales y Educación'),
    (7, 'Economía'),
    (8, 'Derecho y Ciencias Políticas'),
    (9, 'Ingeniería Industrial'),
    (10, 'Ingeniería Civil'),
    (11, 'Ingeniería Pesquera'),
    (12, 'Ingeniería de Minas'),
    (13, 'Ciencias de la Salud'),
    (14, 'Zootecnia');

insert into school
    (school,id_faculty)
VALUES
    ('Agronomía', 1),
    ('Ingeniería Agrícola', 1),
    ('Arquitectura y Urbanismo', 2),
    ('Física', 3),
    ('Matemática', 3),
    ('Ciencias Biológicas', 3),
    ('Ingeniería Electrónica y Telecomunicaciones', 3),
    ('Estadística', 3),
    ('Administración', 4),
    ('Contabilidad', 5),
    ('Historia y Geografía', 6),
    ('Lengua y Literatura', 6),
    ('Educación Inicial', 6),
    ('Educación Primaria', 6),
    ('Ciencias de la Comunicación de la Salud', 6),
    ('Economía', 7),
    ('Derecho', 8),
    ('Ingeniería Industrial', 9),
    ('Ingeniería Informática', 9),
    ('Ingeniería Agroindustrial e Industrias Alimentarias', 9),
    ('Ingeniería Mecatrónica', 9),
    ('Ingeniería Civil', 10),
    ('Ingeniería Pesquera', 11),
    ('Ingeniería de Minas', 12),
    ('Ingeniería Química', 12),
    ('Ingeniería Geológica', 12),
    ('Ingeniería de Petróleo', 12),
    ('Ingeniería Ambiental y Seguridad Industrial', 12),
    ('Medicina Humana', 13),
    ('Enfermería', 13),
    ('Obstetricia', 13),
    ('Psicología', 13),
    ('Estomatología', 13),
    ('Medicina Veterinaria', 14),
    ('Ingeniería Zootecnia', 14);






























