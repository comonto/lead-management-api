// jest.setup.ts
import { AppDataSource } from './src/config/database';
import { initializeDatabase } from './src/config/database';

// Prima di tutti i test, connetti al database
beforeAll(async () => {
  // Assicurati che AppDataSource sia configurato per un database di test separato
  // Potresti leggere da un .env.test o impostare direttamente qui le credenziali
  process.env.DB_NAME = process.env.DB_NAME_TEST || 'lead_db_test';
  process.env.DB_HOST = process.env.DB_HOST_TEST || 'localhost';
  process.env.DB_PORT = process.env.DB_PORT_TEST || '5433'; // Una porta diversa per il DB di test
  process.env.DB_USER = process.env.DB_USER_TEST || 'testuser';
  process.env.DB_PASSWORD = process.env.DB_PASSWORD_TEST || 'testpassword';

  await initializeDatabase(); // Connetti al DB di test
  // Sincronizza lo schema del DB di test. In un ambiente di produzione, useresti le migrazioni.
  // Per i test, 'synchronize: true' è spesso accettabile per creare le tabelle rapidamente.
  // AppDataSource.synchronize = true; // Assicurati che sia vero nel setup di test se non usi migrazioni
  // await AppDataSource.dropDatabase(); // Potrebbe essere utile per un reset completo
  // await AppDataSource.synchronize(); // Ricrea lo schema
});

// Resetta il database prima di ogni test per garantire isolamento
beforeEach(async () => {
  // Pulisce tutte le tabelle per isolare i test
  // Metodo 1: Query diretta per cancellare i dati (più veloce se le tabelle sono molte)
  const entities = AppDataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = AppDataSource.getRepository(entity.name);
    // Assicurati di non eliminare tabelle di sistema o fare TRUNCATE su dati importanti in produzione!
    // Per i test, TRUNCATE è spesso sicuro e veloce.
    await repository.query(`TRUNCATE TABLE "${entity.tableName}" RESTART IDENTITY CASCADE;`);
  }

  // Metodo 2: Usare repository.clear() per ogni entità (più lento per molti dati, ma TypeORM-friendly)
  // await AppDataSource.getRepository(Lead).clear();
  // await AppDataSource.getRepository(Intestatario).clear();
  // await AppDataSource.getRepository(Simulation).clear();
});

// Dopo tutti i test, disconnetti dal database
afterAll(async () => {
  await AppDataSource.destroy(); // Chiudi la connessione al DB
});