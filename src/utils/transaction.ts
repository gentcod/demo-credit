import { parse } from 'uuid-parse';

/**
 * getTimestampFromUUID is used to get an integer value of the timestamp of when an id is generated.
 * When fetching 2 rows for update, the order in which the rows are returned are influenced by the uuid.
 * The function helps to determine the order, preventing transaction deadlock.
 * @param uuid 
 * @returns 
 */
export const getTimestampFromUUID = (uuid: string): number => {
   const bytes = parse(uuid);
   const timestamp = (bytes[0] * 2 ** 24 + bytes[1] * 2 ** 16 + bytes[2] * 2 ** 8 + bytes[3]) / 10000;
   return Math.floor(timestamp / 1000);
}