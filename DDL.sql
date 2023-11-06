create database edugame;
use edugame;

create table member(
    member_id INT,
    username VARCHAR(64) not null,
    password VARCHAR(32) not null,
    email VARCHAR(50) not null,
    age INT,
    PRIMARY KEY(member_id)
);

create table publisher (
    publisher_id INT,
    name VARCHAR(100),
    address VARCHAR(100),
    phone_number VARCHAR(100),
    description TEXT,
    PRIMARY KEY(publisher_id)
); 

create table game(
    game_id INT,
    title VARCHAR(100) not null,
    age_group VARCHAR(10),
    description TEXT,
    min_players INT,
    max_players INT,
    game_url VARCHAR(255),
    publisher_id INT,
    PRIMARY KEY(game_id),
    FOREIGN KEY(publisher_id) REFERENCES publisher(publisher_id)
);

create table publisher_has_game(
    publisher_id INT,
    game_id INT,
    date_of_published DATE,
    FOREIGN KEY(publisher_id) REFERENCES publisher(publisher_id),
    FOREIGN KEY(game_id) REFERENCES game(game_id)
);

create table category(
    category_id INT,
    nametag VARCHAR(50) not null,
    PRIMARY KEY (category_id)
);

create table game_has_category(
    category_id INT,
    game_id INT,
    FOREIGN KEY(category_id) REFERENCES category(category_id),
    FOREIGN KEY(game_id) REFERENCES game(game_id)
);

create table member_rate_game(
    member_id INT,
    game_id INT,
    rate_num INT,
    rate_com TEXT,
    FOREIGN KEY(member_id) REFERENCES member(member_id),
    FOREIGN KEY(game_id) REFERENCES game(game_id)
);

create table member_favorite_game(
    member_id INT,
    game_id INT,
    FOREIGN KEY(member_id) REFERENCES member(member_id),
    FOREIGN KEY(game_id) REFERENCES game(game_id)
);

create table member_played_game(
    member_id INT,
    game_id INT,
    date_played DATE,
    FOREIGN KEY(member_id) REFERENCES member(member_id),
    FOREIGN KEY(game_id) REFERENCES game(game_id)
);

create table image(
    image_id INT AUTO_INCREMENT,
    image_url VARCHAR(255),
    PRIMARY KEY(image_id)
);

create table game_has_image(
    image_id INT,
    game_id INT,
    FOREIGN KEY(image_id) REFERENCES image(image_id),
    FOREIGN KEY(game_id) REFERENCES game(game_id)
);

create table highlightImage(
    highlightImage_id INT AUTO_INCREMENT,
    highlightImage_url VARCHAR(255),
    PRIMARY KEY(highlightImage_id)
);

create table game_has_highlightImage(
    highlightImage_id INT,
    game_id INT,
    FOREIGN KEY(highlightImage_id) REFERENCES highlightImage(highlightImage_id),
    FOREIGN KEY(game_id) REFERENCES game(game_id)
);

create table publisher_has_highlightImage(
    highlightImage_id INT,
    publisher_id INT,
    FOREIGN KEY(highlightImage_id) REFERENCES highlightImage(highlightImage_id),
    FOREIGN KEY(publisher_id) REFERENCES publisher(publisher_id)
);