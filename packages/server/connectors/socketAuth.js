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
      if (!result) {
        console.log("friend doesn't exist");
        return;
      }
      if (username === socket.username) {
        console.log("tried to add self as friend..");
        return;
      }
      const session = socket.request.session;

      if (!session.user.friends) {
        session.user.friends = [];
      } else if (session.user.friends.find(user => user.username === username)) {
        console.log("friend already added");
        return;
      }

      session.user.friends = [
        ...session.user.friends,
        { username, userID: result },
      ];

      socket.request.session.save();
      console.log("friends: ", socket.request.session.user.friends);

      socket.emit("friends", socket.request.session.user.friends);
    }
  });
};
