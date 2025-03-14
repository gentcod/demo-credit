/**
 * WalletIDGenerator helps to generate a unique 10-digit account number
 * Format: 5XXXXXXXXX (starts with 5, followed by 9 random digits)
 */
export class WalletIDGenerator {
   public generate(): string {
      const min = 5000000000;
      const max = 5999999999;

      let accountNumber: string;
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      accountNumber = num.toString();

      return accountNumber;
   }

   public isValid(wallet_id: string): boolean {
      return /^5\d{9}$/.test(wallet_id);
   }
}