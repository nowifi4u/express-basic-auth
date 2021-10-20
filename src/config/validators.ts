import { check } from 'express-validator';

export const validatePassword = check('password')
  .exists()
  .withMessage('Password is empty')
  .isLength({ min: 8 })
  .withMessage('Password length must be at least 8 characters');
