require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const indexRouter = require("./routers/indexRouter");
const authRouter = require("./routers/authRouter");
const helmet = require("helmet");
const cors = require("cors");
const { socketAuth, addFriend } = require("./connectors/socketAuth");
const session = require("express-session");
const redis = require("redis");

const app = express();
const server = require("http").createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

const RedisStore = require("connect-redis")(session);
const redisClient = redis.createClient({ legacyMode: true });
redisClient.connect();

const sessionMiddleware = session({
  name: "sid",
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? "true" : "auto",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // one week
  },
});

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.set("trust proxy", 1);
app.use(sessionMiddleware);

app.use("/api", indexRouter);
app.use("/auth", authRouter);

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

// all ws requests go through this middleware
io.use(wrap(sessionMiddleware));
io.use(socketAuth);

io.on("connect", socket => {
  console.log(`Client ${socket.user.username} connected...`);
  console.log(`sessionID: ${socket.sessionID} / userID: ${socket.userID}`);

  socket.on("add chat", username => {
    addFriend(socket, username);
  });

  socket.on("disconnecting", reason => {
    console.log("Client disconnecting...", reason);
  });
});

// start server
server.listen(process.env.SERVER_PORT || 4000, () => {
  console.log("Server up on port 4000");
});
