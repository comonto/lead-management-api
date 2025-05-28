// data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Lead } from './src/models/lead.model';
import { Holder } from './src/models/holder.model';
import { Simulation } from './src/models/simulation.model';

dotenv.config();

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'lead_db',
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    entities: [Lead, Holder, Simulation],
    migrations: [__dirname + '/src/migrations/*.ts'],
    subscribers: [],
});

export default AppDataSource;