export interface ITransfer {
   amount: number;
   sender_id: string;
   recipient_id: string;
}

export interface Transfer extends ITransfer {
   id: string;
   created_at: Date;
}