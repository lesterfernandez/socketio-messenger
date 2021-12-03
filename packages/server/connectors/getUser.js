const pg = require("../db");

module.exports.getUserByUsername = async username => {
  const queriedUser = await pg.query(
    "SELECT username, passhash, id FROM users u WHERE u.username = $1",
    [username]
  );

  return { rowCount: queriedUser.rowCount, rows: queriedUser.rows };
};

module.exports.getUserById = async id => {
  const queriedUser = await pg.query(
    "SELECT username, passhash, id FROM users u WHERE u.id = $1",
    [id]
  );

  return { rowCount: queriedUser.rowCount, rows: queriedUser.rows };
};
