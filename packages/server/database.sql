CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    passhash VARCHAR(255) NOT NULL,
);

INSERT INTO users(username, passhash) values(
    $1,
    $2
);