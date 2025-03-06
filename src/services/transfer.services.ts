import { db } from "../db";
import { TransferDto } from "../dtos/transfer.dto";
import { ApiResponse } from "../utils/apiResponse";

export class TransferServices {
   public async createTransfer(transfer: TransferDto): Promise<ApiResponse<any>> {
      const isValid = await this._validateAccoount(
         transfer.sender_id, transfer.recipient_id, transfer.amount, transfer.currency
      );
      if (!isValid) {
         return {
            status: 400,
            message: 'Transaction is invalid.'
         }
      }

      await db.querier.transferTx.transfer(transfer, transfer.currency);

      return {
         status: 200,
         message: 'Transaction was success.',
      } 
   }

   private async _validateAccoount(senderId: string, recipientId: string, amount: number, currency: string): Promise<boolean> {
      const sender = await db.querier.account.getAccount(senderId, currency);
      const diff = sender[0].balance - amount;
      if (sender[0].balance < amount || diff < 0) {
         return false;
      }

      const recipient = await db.querier.account.getAccount(recipientId, currency);

      if (sender[0].currency !== recipient[0].currency) {
         return false;
      }

      return true;
   }
}