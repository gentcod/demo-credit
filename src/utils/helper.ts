import { randomInt } from "crypto";

const alphabet = "abcdefghijklmnopqrstuvwxyz"
const mailer = ["@gmail.com", "@hotmail.com"]
const min = 500
const max = 1001

export const isError = (value: unknown): value is Error => {
   return value instanceof Error;
}

export const randomStr = (len: number): string => {
   let res = ''

   for (let i = 0; i < len; i++) {
      const num = randomInt(alphabet.length)
      const ch = alphabet[num]      
      res += ch
   }
   return res;
}

export const randomEmail = (len: number): string => {
   let res = ''

   const str = randomStr(len)
   const index = randomInt(mailer.length)
   const mail = mailer[index]
   res += str+mail

   return res;
}

export const randomMoney = (): number => {
   return randomInt(min, max)
}