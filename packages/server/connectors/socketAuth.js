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

  console.log(`Client ${socket.user.username} connected...`);
  console.log(`sessionID: ${socket.sessionID} / userID: ${socket.userID}`);

  if (session.user.friends) {
    session.user.friends.forEach(friend => {
      redis.hgetall(`userid:${friend.username}`).then(result => {
        friend.connected = result.connected;
        socket.to(result.userID).emit("online", socket.username);
      });
    });
    socket.emit("friends", socket.request.session.user.friends);
  } else {
    session.user.friends = [];
  }
  session.save();
};

module.exports.addFriend = async (redis, socket, username) => {
  const friendConnected = await redis.hget(`userid:${username}`, "connected");

  redis.hget(`userid:${username}`, "userID", (err, result) => {
    if (err) {
      socket.emit("error", err);
      console.log(err);
    } else {
      if (!result || !result.username) {
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
        { username, userID: result, connected: friendConnected },
      ];

      socket.request.session.save();
      console.log("friends: ", socket.request.session.user.friends);

      socket.emit("friends", socket.request.session.user.friends);
    }
  });
};

module.exports.onDisconnect = (redis, socket, reason) => {
  redis.hset(`userid:${socket.username}`, "connected", false);

  // console.log(socket.request.session.user.friends);

  // emit to friends
  socket.request.session.user.friends.forEach(({ userID }) => {
    socket.to(userID).emit("offline", socket.username);
  });

  console.log("Client disconnected...", reason);
};
