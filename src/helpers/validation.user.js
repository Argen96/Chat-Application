import { check } from 'express-validator'
import { validatePassword } from './filterPassword.js';

const signUpValidator = [
  check('username').notEmpty().withMessage('Username name is required')
    .isLength({ max: 250 }).withMessage('Username must not exceed 250 characters'),
  check('full_name').notEmpty().withMessage('Full name is required')
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

export { signUpValidator, logInValidator  }