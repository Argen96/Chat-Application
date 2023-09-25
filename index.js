import express from 'express'
import * as dotenv from 'dotenv';
import passport from "passport";
import session from "express-session";
import auth from "./src/middlewares/auth.js";
import { signUp, logIn, forgotPassword, resetPassword, signInGoogle } from './src/controller/user.controller.js';
import { signUpValidator, logInValidator, forgetPasswordValidator, resetPasswordValidator } from "./src/helpers/validation.user.js"
import asyncHandler from './src/middlewares/asyncHandler.js';
import { errorHandler } from './src/error/errorHandler.js';
import http from 'http';
import { Server as SocketServer } from 'socket.io'
import { db } from './db.js';
import "./src/configuration/oauth2.js";
dotenv.config();

const app = express()
app.use(express.json())
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());
const server = http.createServer(app);
const io = new SocketServer(server)
app.use(express.static('public'));

const port = process.env.PORT

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

app.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure",
  }),
  async (request, response) => {
    const token = await signInGoogle(request);
    response.status(200);
    response.json({ message: token });
  }
);

app.get(
  "/auth/failure",
  asyncHandler(async (request, response) => {
    response.status(401);
    response.json({ message: "Something went wrong" });
  })
);


// Store connected users
const connectedUsers = new Map();

io.on('connection', (socket) => {
  // Handle authentication or user identification
  socket.on('authenticate', (userId) => {
    if (!userId) {
      socket.disconnect(true);
      return;
    }

    // Store the socket with the user ID
    connectedUsers.set(userId, socket);
    console.log(`User connected: ${userId}`);
  });

  socket.on('chatMessage', ({ senderId, recipientId, text }) => {
    // Check if both sender and recipient are connected
    if (!connectedUsers.has(senderId) || !connectedUsers.has(recipientId)) {
      // Handle the case where one or both users are not connected
      console.log('User not connected');
      return;
    }

    // Get the sockets for the sender and recipient
    const senderSocket = connectedUsers.get(senderId);
    const recipientSocket = connectedUsers.get(recipientId);

    // Emit the message to both sender and recipient
    senderSocket.emit('chatMessage', { senderId, recipientId, text });
    recipientSocket.emit('chatMessage', { senderId, recipientId, text });
  });

  socket.on('disconnect', () => {
    // Handle user disconnection and remove from connectedUsers
    for (const [userId, userSocket] of connectedUsers.entries()) {
      if (userSocket === socket) {
        connectedUsers.delete(userId);
        console.log(`User disconnected: ${userId}`);
        break;
      }
    }
  });
});

app.use(errorHandler)

app.all("*", (req, res) => {
  res.status(404).json({ message: "page not found" });
});

app.listen(port, () => console.log(`Example app listening on port ${port}`))