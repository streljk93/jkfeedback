CREATE TABLE `feedback` (
    id int not null auto_increment primary key,
    user_id int not null,
    message text not null,
    rate varchar(150) not null,
    isactive tinyint(1) not null default 1,
    lastupdated timestamp not null default current_timestamp on update current_timestamp
)engine=innodb default charset=utf8;
