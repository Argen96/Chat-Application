import { check } from 'express-validator'
import { validatePassword } from './filterPassword.js';

const signUpValidator = [
  check('first_name').notEmpty().withMessage('Username name is required')
    .isLength({ max: 250 }).withMessage('Username must not exceed 250 characters'),
  check('last_name').notEmpty().withMessage('Full name is required')
    .isLength({ max: 250 }).withMessage('Full name must not exceed 250 characters'),
  check('email').isEmail().withMessage('Invalid email address')
    .isLength({ max: 250 }).withMessage('Email must not exceed 250 characters'),
  check('password_hash').notEmpty().withMessage('Password is required')
    .bail()
    .custom(async (value) => {
      await validatePassword(value);
    })
];


const logInValidator = [
  check('email').isEmail().withMessage('Email Address is required'),
  check('password').notEmpty().withMessage('Password is required')
];

const forgetPasswordValidator = [
  check('email').isEmail().withMessage('Email Address is required')

];

const resetPasswordValidator = [
  check('password').notEmpty().withMessage('Password is required')
  .bail()
  .custom(async (value) => {
    await validatePassword(value);
  })
  .withMessage(
  'Invalid password. It should have Min 1 uppercase letter, Min 1 lowercase letter, Min 1 special character ( #$@!%&*?+/().={}<>,~ ), Min 1 number, Min 8 characters, Max 30 characters'
  ),
];

export { signUpValidator, logInValidator, forgetPasswordValidator, resetPasswordValidator }