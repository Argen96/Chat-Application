import { validationResult } from 'express-validator'
import ApiError from "../error/ApiError.js";
import { insertDataSignUp, verifyDataLogIn  } from '../resposositories/users.table.js';

async function signUp (request){
    const error = validationResult(request)
    console.log(error)
    if (!error.isEmpty()) {
      error.array().forEach(err => {
      throw new ApiError(err.msg, 400)
      })
     }
     const result = await insertDataSignUp(request);
     return result;
}

async function logIn (request){
    const error = validationResult(request)
    console.log(error)
    if (!error.isEmpty()) {
      error.array().forEach(err => {
      throw new ApiError(err.msg, 400)
      })
     }
     const result = await verifyDataLogIn(request);
     return result;
}

export { signUp, logIn }
  