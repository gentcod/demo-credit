import Joi from "joi";
import { CONFIG } from "../utils/config";

export const CreateAccountValidation = Joi.object({
   currency: Joi.string().required().trim().valid(...CONFIG.Currencies),
});

export const FundAccountValidation = Joi.object({
   amount: Joi.number().required().min(1),
   currency: Joi.string().required().trim().valid(...CONFIG.Currencies),
});

export const GetAccountValidation = Joi.object({
   currency: Joi.string().required().trim().valid(...CONFIG.Currencies),
});