export interface IAccount {
   user_id: string;
   balance: number;
   wallet_id: string;
   currency: string;
}

export interface Account extends IAccount {
   id: string;
   created_at: Date;
   updated_at: Date;
}