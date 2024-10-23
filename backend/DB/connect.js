import pg from "pg";

export const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "SoleMate",
  password: Zain_2003,
  port: 5432,
});
