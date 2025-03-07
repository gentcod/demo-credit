export interface IEntry {
   account_id: string;
   description: string;
   amount: number;
}

export interface Entry extends IEntry {
   id: string;
   created_at: Date;
}