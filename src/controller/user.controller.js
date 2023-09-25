import { validationResult } from 'express-validator'
import ApiError from "../error/ApiError.js";
import { insertDataSignUp, verifyDataLogIn, verifyEmailForgotPassword, updatePassword, insertDataSignUpGoogle } from '../resposositories/users.table.js';
import { sendEmail } from '../services/mail.js';

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

async function logIn ( request ){
    const error = validationResult(request)
    if (!error.isEmpty()) {
      error.array().forEach(err => {
      throw new ApiError(err.msg, 400)
      })
     }
     const result = await verifyDataLogIn(request);
     return result;
}

async function forgotPassword( request ) {
  const error = validationResult(request)
   if (!error.isEmpty()) {
     error.array().forEach(err => {
      throw new ApiError(err.msg, 400)
     })
   }
   const { email } = request.body;
   const account = await verifyEmailForgotPassword(email);
   if (account)  await sendEmail(account);
   return "Please Check your email to update the password";
 }

 async function resetPassword( request ) {
  const error = validationResult(request)
  if (!error.isEmpty()) {
    error.array().forEach(err => {
    throw new ApiError(err.msg, 400)
    })
   }
  const { code } = request.query;
  const { password } = request.body
  const data = { email_token: code, password: password };
  const result = await updatePassword(data);
  return result;
}

async function signInGoogle(request) {
  const { email, id, given_name, family_name } = request.user.profile;
  const account = {
    email: email,
    google_id: id,
    first_name: given_name,
    last_name: family_name,
  };
  const token = await insertDataSignUpGoogle(account);
  return token;
}

export { signUp, logIn, forgotPassword, resetPassword, signInGoogle }
  