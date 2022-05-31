create table users(
    id int primary key AUTO_INCREMENT,
    name varchar(250),
    contact varchar(20),
    email varchar(50),
    password varchar(20),
    status varchar(20),
    role varchar(20),
    UNIQUE (email)
)

insert into users(name,contact,email,password,status,role) values('Admin','8979897876', 'admin@gmail.com','admin123','true','admin');

