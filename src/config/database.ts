// src/config/database.ts
import 'reflect-metadata'; // Importa anche qui per sicurezza
import { DataSource } from 'typeorm';
import { Lead } from '../models/lead.model';
import { Holder } from '../models/holder.model';
import { Simulation } from '../models/simulation.model';
import dotenv from 'dotenv';

dotenv.config(); // Carica le variabili d'ambiente da .env

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'lead_db',
    synchronize: false, // !!! IMPORTANTE: Non usare synchronize: true in produzione! Usare le Migrations.
    logging: true, // Abilita il logging delle query SQL (utile per il debug)
    entities: [Lead, Holder, Simulation], // Qui elenchi le tue classi Entity
    migrations: [], // Qui elencherai i tuoi file di migrazione (vedremo dopo)
    subscribers: [],
});

// Funzione per inizializzare il database
export const initializeDatabase = async () => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            console.log('Database connected successfully!');
        }
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1); // Esci dall'applicazione in caso di errore di connessione
    }
};