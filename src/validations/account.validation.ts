import Joi from "joi";

export const CreateAccountValidation = Joi.object({
   currency: Joi.string().required().trim().valid('USD', 'EUR', 'GBP', 'NGN'),
});

export const FundAccountValidation = Joi.object({
   amount: Joi.number().required().min(1),
   currency: Joi.string().required().trim().valid('USD', 'EUR', 'GBP', 'NGN'),
});

export const GetAccountValidation = Joi.object({
   currency: Joi.string().required().trim().valid('USD', 'EUR', 'GBP', 'NGN'),
});