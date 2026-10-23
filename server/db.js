/* ==========================================================================
   DATABASE CONNECTION
   ==========================================================================
   Every file that needs the database imports "db" from here.
   The address of the database comes from DATABASE_URL in the .env file.
   ========================================================================== */

import "dotenv/config";
import pg from "pg";

const db = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});

export default db;
