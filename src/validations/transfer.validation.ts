import Joi from "joi";
import { CONFIG } from "../utils/config";

export const SendFundValidation = Joi.object({
   wallet_id: Joi.string().required().pattern(/^5\d{9}$/).trim(),
   amount: Joi.number().required().min(1),
   currency: Joi.string().required().trim().valid(...CONFIG.Currencies),
});