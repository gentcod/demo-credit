export interface IAuth {
   id: string;
   email: string;
   password: string;
}

export interface Auth extends IAuth {
   created_at: Date;
   updated_at: Date;
}