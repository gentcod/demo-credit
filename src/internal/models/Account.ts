export interface IAccount {
   user_id: string;
   balance: number;
   account_no: string;
   currency: string;
}

export interface Account extends IAccount {
   id: string;
   created_at: Date;
   updated_at: Date;
}