import { Sequelize } from "sequelize";
import pg from "pg";

const conn = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      dialectModule: pg,  
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: "postgres",
        dialectModule: pg,
        logging: console.log,
      },
    );

async function connection() {
  try {
    await conn.authenticate();
    console.log("Conexão estabelecida com Postgres");
  } catch (error) {
    console.error(error);
  }
}

connection();
export default conn;
