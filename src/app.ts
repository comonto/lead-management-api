import 'reflect-metadata'; // DEVE ESSERE IL PRIMO IMPORT
import express from 'express';
import * as dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import leadRoutes from './routes/lead.route';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config(); // Carica le variabili d'ambiente dal file .env

export const app = express();
const PORT = process.env.PORT || 3000;

// Middleware di Express
app.use(express.json()); // Per parsare il body delle richieste in JSON

// Inizializza la connessione al database
initializeDatabase()
    .then(() => {
        // Definisci le rotte API
        app.use('/api', leadRoutes);

        // Middleware per la gestione degli errori (DEVE essere l'ultimo middleware)
        app.use(errorHandler);

        // Avvia il server Express
        app.listen(PORT, () => {
            console.log(`🚀 Server listening on port ${PORT}`);
            //   console.log(`📚 API Docs available at http://localhost:${PORT}/api/leads (POST)`);
        });
    })
    .catch(error => {
        console.error('Failed to start server due to database connection error:', error);
        process.exit(1); // Termina l'applicazione se non si riesce a connettere al DB
    });

