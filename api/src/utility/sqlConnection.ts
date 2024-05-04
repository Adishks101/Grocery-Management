import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

let { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = process.env;

const sequelize = new Sequelize(DB_NAME!, DB_USER!, DB_PASSWORD!, {
  host: DB_HOST,
  dialect: "mysql",
});

export default sequelize;