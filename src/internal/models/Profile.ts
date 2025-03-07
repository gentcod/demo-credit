export interface IProfile {
   user_id: string;
   first_name: string;
   last_name: string;
}

export interface Profile extends IProfile {
   id: string;
   created_at: Date;
   updated_at: Date;
}