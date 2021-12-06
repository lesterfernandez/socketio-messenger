const { v4: uuidv4 } = require("uuid");

module.exports.socketAuth = (socket, next) => {
  if (!socket.request.session.user || !socket.request.session.user.id) {
    console.log("unauth request");
    return next(new Error("Not authenticated. Bad request!"));
  }
  socket.user = { ...socket.request.session.user };

  if (!socket.userID || !socket.sessionID) {
    if (!socket.request.session.userID) {
      socket.request.session.userID = uuidv4();
      console.log("setting new user id :", socket.request.session.userID);
      socket.request.session.save();
    }

    socket.userID = socket.request.session.userID;
    socket.sessionID = socket.request.sessionID;
    console.log("retrieving userID : ", socket.userID);
  }
  next();
};

module.exports.addFriend = (socket, username) => {
  // for (let [id, socket] of io.of("/").sockets) {
  //   if (socket.user.username === "lester") {
  //     console.log("found friend");
  //     console.log(id);
  //   }
  // }
};
