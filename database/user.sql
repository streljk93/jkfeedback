CREATE TABLE `user` (
	id int not null auto_increment primary key,
	username varchar(250) not null,
	email varchar(250) not null,
	phone int,
	password varchar(250) not null,
	isactive tinyint(1) not null default 1,
	lastupdated timestamp not null
)engine=innodb default charset=utf8;
