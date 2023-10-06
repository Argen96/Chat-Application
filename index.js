import express from 'express'
import * as dotenv from 'dotenv';
import passport from "passport";
import session from "express-session";
import cors from 'cors'
import auth from "./src/middlewares/auth.js";
import http from 'http';
import { Server } from 'socket.io'
import { signUp, logIn, forgotPassword, resetPassword, signInGoogle } from './src/controller/user.controller.js';
import { signUpValidator, logInValidator, forgetPasswordValidator, resetPasswordValidator } from "./src/helpers/validation.user.js"
import asyncHandler from './src/middlewares/asyncHandler.js';
import { errorHandler } from './src/error/errorHandler.js';
import { landingPage, searchUsers } from './src/services/homePage.js';
import { sendMessage } from './src/services/messages.js';
import { showMessageHistory, showAllMessages } from './src/services/messages.js'
import "./src/configuration/oauth2.js";

dotenv.config();

const app = express()

app.use(express.json())
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true
  })
);


const port = process.env.PORT
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('authenticate', (userId) => {
    socket.join(`user_${userId}`);
  });

  socket.on('chat message', async (message) => {
    await sendMessage(message)
    io.to(`user_${message.recipient_id}`).emit('chat message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.get("/health-check", async (request, response) => {
  response.json({ isHealthy: true });
});

app.post(
  "/api/sign-up", signUpValidator, asyncHandler(async (request, response) => {
    const result = await signUp(request)
    response.status(200)
    response.json(result)
  }))

app.post(
  "/api/log-in", logInValidator, asyncHandler(async (request, response) => {
    const user = await logIn(request)
    response.status(200)
    response.json({ ...user, password: "" })
  }))

app.post(
  "/api/forgot-password", forgetPasswordValidator,
  asyncHandler(async (request, response) => {
    const result = await forgotPassword(request);
    response.status(200);
    response.json({ message: result });
  })
);

app.post(
  "/api/reset-password", resetPasswordValidator,
  asyncHandler(async (request, response) => {
    const result = await resetPassword(request);
    response.status(200);
    response.json({ message: result });
  })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
  }),

  async (request, response) => {
    const token = await signInGoogle(request);
    response.redirect(`http://localhost:3000/welcome?token=${token}`)
  }
);

app.get(
  "/auth/failure",
  asyncHandler(async (request, response) => {
    response.status(401);
    response.json({ message: "Something went wrong" });
  })
);

app.get(
  "http://localhost:3000/welcome",
  asyncHandler(async (request, response) => {
    response.status(200);
    response.json({ message: "You are loggin successsfully" });
  })
);

app.get(
  "/api/home", auth,
  asyncHandler(async (request, response) => {
    const res = await landingPage(request)
    response.status(200);
    response.json(res);
  })
);
app.get(
  "/api/search-user", auth,
  asyncHandler(async (request, response) => {
    const res = await searchUsers(request)
    response.status(200);
    response.json(res);
  })
);

app.get(
  "/api/user/current-user", auth,
  asyncHandler(async (request, response) => {
    const id = request.user.userId
    response.status(200);
    response.json({ user_id: id });
  })
);

app.get(
  "/api/chat/messages/:senderId/:recipientId", auth,
  asyncHandler(async (request, response) => {
    const messages = await showMessageHistory(request)
    response.status(200);
    response.json(messages);
  })
);

app.get(
  "/api/chat-history", auth,
  asyncHandler(async (request, response) => {
    const messages = await showAllMessages(request)
    response.status(200);
    response.json(messages);
  })
);


app.use(errorHandler)

app.all("*", (req, res) => {
  res.status(404).json({ message: "page not found" });
});

server.listen(port, () => console.log(`Example server listening on port ${port}`))