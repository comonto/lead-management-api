// src/__tests__/lead.integration.test.ts
import request from 'supertest';
import express from 'express';
import { AppDataSource } from '../../src/config/database';
import { Lead } from '../../src/models/lead.model';
import { LeadService } from '../../src/services/lead.service'; // Importa LeadService
import { CrmService } from '../../src/services/crm.service'; // Importa CrmService
import leadRoutes from '../../src/routes/lead.route';
import { errorHandler } from '../../src/middlewares/errorHandler';

// ... (configurazione Jest e dati di test) ...

describe('Lead API Integration Tests', () => {
    const leadRepository = AppDataSource.getRepository(Lead);

    let mockCrmService: jest.Mocked<CrmService>; // Definisci il mock
    let app: express.Application; // Definisci l'app qui

    beforeEach(() => {
        // Resetta e riconfigura il mock prima di ogni test
        mockCrmService = {
            syncLead: jest.fn().mockResolvedValue({ status: 'success', message: 'Mocked CRM sync success.' }),
        } as jest.Mocked<CrmService>;

        // Inietta il mock nel LeadService
        const leadService = new LeadService(mockCrmService);

        // Re-crea l'app Express con le rotte che usano il LeadService con il mock
        app = express();
        app.use(express.json());
        // Se il tuo controller crea un nuovo LeadService internamente, devi iniettarlo lì
        // Oppure, se il controller accetta il service, puoi farlo così:
        // const leadController = new LeadController(leadService);
        // app.use('/api', leadRoutes(leadController)); // Se le rotte accettano un controller
        // Per come è ora il tuo setup, il controller istanzia il servizio, quindi non puoi iniettare qui direttamente.
        // L'approccio migliore in questo caso è mockare il modulo intero o usare un'interfaccia.
    });


    let testLeadData = {
        phoneNumber: '3339876543',
        city: 'Roma',
        homeValue: 180000,
        mortgageAmount: 120000,
        intestatari: [
            {
                type: 'first',
                nome: 'Giulia',
                cognome: 'Verdi',
                email: 'giulia@verdi.it',
                dataNascita: '1990-02-10',
                redditoMensile: 2800,
                mensilita: 12,
            },
        ],
    };

    it('should call CRM service with correct data', async () => {
        await request(app)
            .post('/api/lead')
            .send(testLeadData)
            .expect(201);

        // Verifica che il metodo syncLead del mock sia stato chiamato
        expect(mockCrmService.syncLead).toHaveBeenCalledTimes(1);
        expect(mockCrmService.syncLead).toHaveBeenCalledWith(expect.objectContaining({
            phoneNumber: testLeadData.phoneNumber,
            // Aggiungi altre proprietà che ti aspetti vengano passate al CRM
        }));
    });

    it('should handle CRM sync failure', async () => {
        // Forza il mock a fallire per questo test specifico
        mockCrmService.syncLead.mockResolvedValueOnce({ status: 'failed', message: 'Mocked CRM sync failure.' });

        const res = await request(app)
            .post('/api/lead')
            .send(testLeadData)
            .expect(201); // O 200, a seconda della risposta API

        expect(res.body.crmSyncStatus).toBe('failed');
    });
});