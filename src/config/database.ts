import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME as string, process.env.DB_USER as string, process.env.DB_PASSWORD,
    { host: process.env.DB_HOST, dialect: 'mysql', port: parseInt(process.env.DB_PORT || '3306') }
);

export function syncDatabase() {
    sequelize.sync()
        .then(() => {
            console.log('Synced database');
        })
        .catch(err => {
            console.error('Error syncing database', err);
        });
}