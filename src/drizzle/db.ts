import "dotenv/config"
import { Client } from "pg"
import {drizzle} from "drizzle-orm/node-postgres";
import * as schema from "./schema"
 
 
export const client = new Client({
    connectionString: process.env.DATABASE_URL as string
});
 
const main = async () =>{
    await client.connect(); //connect to the database  
}
 
main().catch(console.error)

export const db = drizzle(client,{schema, logger:true});
