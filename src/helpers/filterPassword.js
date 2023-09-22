import ApiError from "../error/ApiError.js";

async function validatePassword(password) {
    const reg_expression =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?+/().={}<>,~])[A-Za-z\d#$@!%&*?+/().={}<>,~]{8,32}$/;
  if (!reg_expression.test(password))
  throw new ApiError(
    "The password needs to have Min 1 uppercase letter Min 1 lowercase letter, Min 1 special character ( #$@!%&*?+/().={}<>,~ ), Min 1 number,Min 8 characters,Max 30 characters",
    400
        );
    return true
}
  
export { validatePassword }