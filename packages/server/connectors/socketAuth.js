module.exports.socketAuth = (socket, next) => {
  if (!socket.request.session.user || !socket.request.session.user.id) {
    console.log("unauth request");
    return next(new Error("Not authenticated. Bad request!"));
  }
  socket.user = { ...socket.request.session.user };

  if (!socket.userID || !socket.sessionID) {
    socket.userID = socket.user.userID;
    socket.username = socket.user.username;
    socket.sessionID = socket.request.sessionID;
  }
  next();
};

module.exports.setRedisUser = (redis, socket) => {
  redis.set(`userid:${socket.username}`, socket.userID);
};

module.exports.initialize = socket => {
  socket.join(socket.userID);

  console.log(`Client ${socket.user.username} connected...`);
  console.log(`sessionID: ${socket.sessionID} / userID: ${socket.userID}`);

  if (socket.request.session.user.friends) {
    socket.emit("friends", socket.request.session.user.friends);
  }
};

module.exports.addFriend = (redis, socket, username) => {
  redis.get(`userid:${username}`, (err, result) => {
    if (err) {
      socket.emit("error", err);
      console.log(err);
    } else {
      const session = socket.request.session;

      if (!session.user.friends) {
        session.user.friends = [];
      }

      session.user.friends = [...session.user.friends, { username: result }];

      socket.request.session.save();
      console.log(socket.request.session.user);

      socket.emit("friend added", result);
    }
  });
};
