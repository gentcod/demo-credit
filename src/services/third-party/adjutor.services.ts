import { CONFIG } from "../../utils/config";
import axios from "axios";
import { ThirdPartyApiResponse } from "./model";

export class LendsqrAdjutor {
   private _apiKey: string = CONFIG.AdjutorApiKey;

   private _sendResponse(resp: any, isError = false): ThirdPartyApiResponse {
      return resp && !isError
         ?
         {
            isError: false,
            data: {
               status: resp?.status,
               message: '',
               data: resp?.data?.data
            },
         }
         : {
            isError: true,
            data: {
               status: resp?.response?.status,
               message: resp?.response?.data?.message
            },
         };
   }

   public async checkKarama(identity: string) {
      try {
         const response = await axios.get(
            `${CONFIG.AdjutorBaseUrl}/v2/verification/karma/:${identity}`,
            {
               headers: {
                  Authorization: `Bearer ${this._apiKey}`,
               },
            }
         );
         console.log('api-response', response);
         return this._sendResponse(response);
      } catch (error) {
         return this._sendResponse(error, true);
      }
   }
}