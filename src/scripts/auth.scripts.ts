export class AuthScripts {
   createUser: string = `INSERT INTO auths (email, password, created_at) VALUES (?,?,?)`;
   getUserByEmail: string = `SELECT * FROM auths WHERE email = ?`;
}