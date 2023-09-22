import express from 'express'
import * as dotenv from 'dotenv';
import { signUp, logIn } from './src/controller/user.controller.js';
import { signUpValidator, logInValidator } from "./src/helpers/validation.user.js"
import asyncHandler from './src/middlewares/asyncHandler.js';
import { errorHandler } from './src/error/errorHandler.js';
dotenv.config();

const app = express()
app.use(express.json())

const port = process.env.PORT 

app.get("/health-check",  async (request, response) => {
    response.json({ isHealthy: true });
  });

app.post ( "/api/sign-up", signUpValidator, asyncHandler(async (request,response)=>{
    const result = await signUp(request)
    response.status(200)
    response.json(result)
}))

app.post ( "/api/log-in", logInValidator, asyncHandler(async (request,response)=>{
    const result = await logIn(request)
    response.status(200)
    response.json(result)
}))

app.use ( errorHandler )

app.all("*", (req, res) => {
    res.status(404).json({ message: "page not found" });
  });

app.listen(port, () => console.log(`Example app listening on port ${port}`))