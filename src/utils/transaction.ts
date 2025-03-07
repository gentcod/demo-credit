import { parse } from 'uuid-parse';

export const getTimestampFromUUID = (uuid: string): number => {
   const bytes = parse(uuid);
   const timestamp = (bytes[0] * 2 ** 24 + bytes[1] * 2 ** 16 + bytes[2] * 2 ** 8 + bytes[3]) / 10000;
   return Math.floor(timestamp / 1000);
}