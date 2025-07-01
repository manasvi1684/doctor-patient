// data-source.ts
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  // This is the single source of truth now
  url: process.env.DATABASE_URL,
  ssl: {
    // This is required for Render's managed databases
    rejectUnauthorized: false,
  },
  entities: ['dist/**/*.entity.js'], // Point to compiled JS files in 'dist'
  migrations: ['dist/migrations/*.js'], // Point to compiled JS migrations
  synchronize: false, // Never true in production
  logging: true, // Good for debugging
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;