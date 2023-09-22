import { db } from "../../db.js";
import ApiError from "../error/ApiError.js";
import bcrypt from "bcrypt";;
import jwt from "jsonwebtoken";

async function insertDataSignUp(request) {
try{
  const data = request.body
  const { email, password_hash } = data ;
  const hashPassword = await bcrypt.hash(password_hash, 10);
  const account = {
    ...data,
    password_hash: hashPassword,
  };
   await db("users").insert(account);
  const result = await db("users")
    .where({
      email: email,
      password_hash: hashPassword
    })
    .select("user_id", "username", "full_name", "email");
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

export { insertDataSignUp, verifyDataLogIn }