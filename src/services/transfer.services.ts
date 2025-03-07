import { AccountResponse } from "../dtos/account.dto";
import { db } from "../db";
import { TransferDto } from "../dtos/transfer.dto";
import { ApiResponse } from "../utils/apiResponse";

type ValidAccountRes = {
   isValid: boolean;
   sender_id: string;
   recipient_id: string;
}

export class TransferServices {
   public async sendFund(transfer: TransferDto, user_id: string): Promise<ApiResponse<any>> {
      const auth = await db.querier.user.getAuthById(user_id);
      if (!auth[0]) {
         return {
            status: 403,
            message: 'Transaction cannot be executed.'
         }
      }


      const validRes = await this._validateAccoount(
         auth[0].id, transfer.wallet_id, transfer.amount, transfer.currency
      );
      if (!validRes.isValid) {
         const msg = validRes.recipient_id === undefined
            ? 'Recipient account does not exist'
            :
         validRes.sender_id === 'same'
            ? 'You cannot send money to yourself'
            :
         validRes.sender_id === 'low' 
            ? 'Insufficient funds'
            : `Wallet is not a ${transfer.currency} based wallet.`

         const code = validRes.recipient_id === undefined ? 404 : 400
         return {
            status: code,
            message: `Transaction not successful. ${msg}`
         }
      }

      const account = await db.querier.transferTx.transfer({
         sender_id: validRes.sender_id,
         recipient_id: validRes.recipient_id,
         amount: transfer.amount
      }, transfer.currency);

      const resp = AccountResponse.createResponse(account)

      return {
         status: 200,
         message: 'Transaction was successful.',
         data: {
            account: resp,
         }
      }
   }

   private async _validateAccoount(
      senderId: string, wallet_id: string, amount: number, currency: string
   ): Promise<ValidAccountRes> {
      const sender = await db.querier.account.getAccount(senderId, currency);
      const diff = sender[0].balance - amount;
      if (sender[0].balance < amount || diff < 0) {
         return { sender_id: 'low', recipient_id: '', isValid: false }
      };
      const recipient = await db.querier.account.getAccountByWalletId(wallet_id);
      if (!recipient[0]) {
         return { sender_id: '', recipient_id: undefined, isValid: false }
      }
            
      if (sender[0].id === recipient[0].id) {
         return { sender_id: 'same', recipient_id: '', isValid: false }
      }

      if (sender[0].currency !== recipient[0].currency) {
         return { sender_id: '', recipient_id: '', isValid: false }
      }

      return { sender_id: sender[0].id, recipient_id: recipient[0].id, isValid: true };
   }
}