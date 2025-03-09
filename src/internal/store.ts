import { Knex } from "knex";
import { AccountQueries } from "./queries/account.queries";
import { EntryQueries } from "./queries/entries.queries";
import { TransferQueries } from "./queries/transfer.queries";
import { AuthQueries } from "./queries/auth.queries";
import { ProfileQueries } from "./queries/profile.queries";
import { UserTx } from "./transactions/user.tx";
import { TransferTx } from "./transactions/transfer.tx";
import { AccountTx } from "./transactions/account.tx";

export class Querier {
   private _db: Knex
   public user: AuthQueries;
   public account: AccountQueries;
   public transfer: TransferQueries;
   public entry: EntryQueries;
   public profile: ProfileQueries;
   public userTx: UserTx;
   public transferTx: TransferTx;
   public accountTx: AccountTx;

   constructor(db: Knex) {
      this._db = db;
      this.user = new AuthQueries(db);
      this.account = new AccountQueries(db);
      this.transfer = new TransferQueries(db);
      this.entry = new EntryQueries(db);
      this.profile = new ProfileQueries(db);
      this.userTx = new UserTx(db, this.user, this.profile);
      this.transferTx = new TransferTx(db, this.transfer, this.account, this.entry);
      this.accountTx = new AccountTx(db, this.account, this.entry);
   }
}
