import Joi from "joi";

export const AuthValidation = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).trim().required(),
  password: Joi.string().required().min(8).pattern(/^\S+$/).trim(),
});