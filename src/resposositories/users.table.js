import { db } from "../../db.js";
import ApiError from "../error/ApiError.js";
import bcrypt from "bcrypt";;
import jwt from "jsonwebtoken";
import crypto from "crypto";

async function insertDataSignUp( request ) {
try{
  const data = request.body
  const { email, password_hash } = data ;
  const token = crypto.randomBytes(10).toString("hex");
  const hashPassword = await bcrypt.hash(password_hash, 10);
  const account = {
    ...data,
    password_hash: hashPassword,
    email_token: token,
  };
  await db("users").insert(account);
  const result = await db("users")
  .where({ email: email })
  .select("user_id", "first_name", "last_name", "email");
  return result;
} catch(err){
    if (err.code === 'ER_DUP_ENTRY')  throw new ApiError("This email is already used!", 400);
}
}

async function verifyDataLogIn ( request ) {
    const { email, password } = request.body;
    const user = await db("users")
      .where({
        email: email,
      })
      .first();
    if (!user) throw new ApiError(`Invalid Credentials!`, 401);
    const isValidPass = bcrypt.compareSync(password, user.password_hash);
    if (!isValidPass) throw new ApiError(`Invalid Credentials!`, 401);
    const token = jwt.sign(
      { email: email, userId: user.user_id, },
        process.env.TOKEN_KEY,
      { expiresIn: "10d" }
    );  
    user.token = token;
    return user;
  }

  async function verifyEmailForgotPassword( email ) {
    const user = await db("users")
      .where({
        email: email,
      })
      .first();
    if (!user) throw new ApiError(`This email does not have an account with us!`, 401);
    return user;
  }

  async function updatePassword(data) {
    const { email_token, password } = data;
    const user = await db("users")
      .where({
        email_token: email_token,
      })
      .first();
    if (!user) throw new ApiError(`Invalid request!`, 404);
    const isTheSamePssw = bcrypt.compareSync(password, user.password_hash);
    if(isTheSamePssw ) throw new ApiError(`The new password cannot be the same as the previous password!`, 401);
    const hashPassword = await bcrypt.hash(password, 10);
    await db("users")
      .update({ password_hash: hashPassword })
      .where({ email_token: email_token });
    return "Password is updated successfully";
  }
  
  async function insertDataSignUpGoogle(account) {
    const { email, google_id } = account;
    const usedEmail = await db("users")
      .where({
        email: email,
      })
      .select("email");
    const previouslyRegistered = await db("users")
      .where({
        google_id: google_id,
      })
      .first();
    let user_id = "";
    if ( usedEmail.length != 0 || previouslyRegistered ) {
      await db("users").update(account).where({ email: email }).orWhere({ google_id: google_id });
      const accountId = await db("users").where({ email: email }).first();
      console.log(accountId)
      user_id = accountId.user_id;
      
    } else if (!previouslyRegistered) {
      const token = crypto.randomBytes(10).toString("hex");
      account.email_token = token;
      [ user_id ] = await db("users").insert(account).select('user_id');
    } 
    const token = jwt.sign(
      { email: email, userId: user_id },
      process.env.TOKEN_KEY,
      { expiresIn: "10d" }
    );
    return token;
  }

  async function allUsers(user_id) {
    const user_data = await db("users")
        .where({ user_id: user_id })
        .select("user_id", "first_name", "last_name");
    const random_users = await db("users").whereNot({ user_id: user_id })
        .select("user_id", "first_name", "last_name");
    return {
        original_user: user_data,
        other_users: random_users
    }

}

async function selectiveUsers(first_name, last_name) {
  let filters = db("users").select("*")
  if(first_name && last_name)
  filters = filters.where( "first_name", "like", `%${first_name}%`, "last_name", "like", `%${last_name}%`)
  if(first_name && !last_name)
  filters = filters.where( "first_name", "like", `%${first_name}%`, "last_name", "like", `%${first_name}%`)
  filters = await filters
  return filters
}

export { insertDataSignUp, verifyDataLogIn, verifyEmailForgotPassword,  updatePassword, insertDataSignUpGoogle, allUsers, selectiveUsers }