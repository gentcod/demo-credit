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

export const GetTransactionValidation = Joi.object({
   currency: Joi.string().required().trim().valid(...CONFIG.Currencies),
   page_id: Joi.number(),
   page_size: Joi.number(),
});