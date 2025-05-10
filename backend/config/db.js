import {Sequelize} from "sequelize";
import fs from "fs";
import dotenv from 'dotenv'
import path from 'path'; 
import os from 'os';

if (
  process.env.NODE_ENV !== 'production' &&
  process.env.NODE_ENV !== 'production_docker'
  ) {
  dotenv.config({ path: '../.env' });
}

const dbName = process.env.DB_NAME || "expense_tracker";
const dbUser = process.env.DB_USER || "root";
const dbPassword = process.env.DB_PASSWORD || "admin@123";
const dbHost = process.env.DB_HOST || "localhost";
const dbPort = parseInt(process.env.DB_PORT || "3306", 10);
const dbDialect = process.env.DB_DIALECT || "mysql";

const sslOptions = {};
let tempCaPath = null
if (process.env.DB_SSL_CA_BASE64){
  try {
    const caContent = Buffer.from(process.env.DB_SSL_CA_BASE64, 'base64').toString('ascii');
    // Create a temporary file in a writable directory within the container
    tempCaPath = path.join(os.tmpdir(), 'db_ca.pem'); // e.g., /tmp/db_ca.pem
    fs.writeFileSync(tempCaPath, caContent);
    sslOptions.ca = fs.readFileSync(tempCaPath); // Read it back for Sequelize
    console.log(`Using CA certificate from DB_SSL_CA_BASE64, written to ${tempCaPath}`);
  } catch (e) {
    console.error("Error processing DB_SSL_CA_BASE64:", e);
    // Decide if this is a fatal error
  }
}else if(process.env.DB_SSL_CA_CONTENT){
  try {
        tempCaPath = path.join(os.tmpdir(), 'db_ca.pem');
        fs.writeFileSync(tempCaPath, process.env.DB_SSL_CA_CONTENT.replace(/\\n/g, '\n')); // Handle escaped newlines
        sslOptions.ca = fs.readFileSync(tempCaPath);
        console.log(`Using CA certificate from DB_SSL_CA_CONTENT, written to ${tempCaPath}`);
    } catch (e) {
        console.error("Error processing DB_SSL_CA_CONTENT:", e);
    }
}else if(process.env.DB_SSL_CA_PATH && fs.existsSync(process.env.DB_SSL_CA_PATH)){
  sslOptions.ca =  fs.readFileSync(process.env.DB_SSL_CA_PATH);
  console.log(`Using CA certificate from path: ${process.env.DB_SSL_CA_PATH}`);
}

const sequelizeOptions = {
  host: dbHost,
  port: dbPort,
  dialect: dbDialect,
  logging: process.env.NODE_ENV === 'development' ? console.log : false, // Optional: log SQL in dev
  dialectOptions: sslOptions.ca ? { ssl: sslOptions } : {},
};

const sequelize = new Sequelize(dbName, dbUser, dbPassword, sequelizeOptions);

const dbConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log(`DB Connection to ${dbHost}:${dbPort}/${dbName} has been established successfully.`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }finally{
    if(tempCaPath && fs.existsSync(tempCaPath)){
      try{
        fs.unlinkSync(tempCaPath)
      } catch(e){
        console.log(`Error cleaning up temporary CA file at ${tempCaPath}:`,e);
      }
  }
  }
};
export { dbConnect, sequelize };
