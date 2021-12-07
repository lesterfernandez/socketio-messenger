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
  redis.hset(
    `userid:${socket.username}`,
    "userID",
    socket.userID,
    "connected",
    true
  );
};

module.exports.initialize = async (redis, socket) => {
  socket.join(socket.userID);
  const session = socket.request.session;

  console.log(
    `${socket.username} : sessionID: ${socket.sessionID} / userID: ${socket.userID}`
  );

  if (session.user.friends) {
    for (let friend of session.user.friends) {
      const query = await redis.hgetall(`userid:${friend.username}`);
      friend.connected = query.connected;
      socket.to(query.userID).emit("online", socket.username);
    }
    session.save();
    socket.emit("friends", socket.request.session.user.friends);
  } else {
    session.user.friends = [];
    session.save();
  }
};

module.exports.addFriend = async (redis, socket, username) => {
  redis.hgetall(`userid:${username}`, (err, result) => {
    if (err) {
      socket.emit("error", err);
      console.log(err);
    } else {
      if (!result || !result.userID) {
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
        { username, userID: result.userID, connected: result.connected },
      ];

      session.save();
      console.log("friends: ", session.user.friends);

      socket.emit("friends", session.user.friends);

      session.user.friends.forEach(friend => {
        socket.to(friend.userID).emit("online", socket.username);
      });
    }
  });
};

module.exports.onDisconnect = (redis, socket, reason) => {
  redis.hset(`userid:${socket.username}`, "connected", false);

  // emit to friends
  socket.request.session.user.friends.forEach(({ userID }) => {
    socket.to(userID).emit("offline", socket.username);
  });

  console.log("Client disconnected...", reason);
};
