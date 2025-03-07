import Joi from "joi";

export const LoginValidation = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).trim().required(),
  password: Joi.string().required().min(8).pattern(/^\S+$/).trim(),
});

export const SignUpValidation = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).trim().required(),
  password: Joi.string().required().min(8).pattern(/^\S+$/).trim(),
  first_name: Joi.string().required().trim(),
  last_name: Joi.string().required().trim(),
});