const express = require("express");
const { Server } = require("socket.io");
const indexRouter = require("./routers/indexRouter");
const passport = require("passport");
const session = require("express-session");
const helmet = require("helmet");
const cors = require("cors");

const app = express();
const server = require("http").createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

const sessionMiddleware = session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
});

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

app.use("/api", indexRouter);

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize));
io.use(wrap(passport.session));

io.on("connection", socket => {});

// start server
server.listen(4000, () => {
  console.log("Server up on port 4000");
});
