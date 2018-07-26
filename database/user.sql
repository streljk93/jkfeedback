CREATE TABLE `user` (
        id int not null auto_increment primary key,
        avatar varchar(500) not null,
        username varchar(250) not null,
        email varchar(250) not null,
        phone varchar(250),
        password varchar(250) not null,
        isactive tinyint(1) not null default 1,
        lastupdated timestamp not null default current_timestamp on update current_timestamp
)engine=innodb default charset=utf8;