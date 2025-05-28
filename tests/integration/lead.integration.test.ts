import request from 'supertest';
import { app } from '../../src/app'; // dove configuri Express

describe('POST /api/lead', () => {
    it('crea un nuovo lead con intestatari validi', async () => {
        const res = await request(app)
            .post('/api/lead')
            .send({
                phone: '3339876543',
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
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.leadId).toBeDefined();
    });

    it('rifiuta input con email non valida', async () => {
        const res = await request(app)
            .post('/api/lead')
            .send({
                phone: '3331112222',
                city: 'Torino',
                homeValue: 150000,
                mortgageAmount: 100000,
                intestatari: [
                    {
                        type: 'first',
                        nome: 'Luca',
                        cognome: 'Neri',
                        email: 'email-non-valida',
                        dataNascita: '1991-05-20',
                        redditoMensile: 2500,
                        mensilita: 13,
                    },
                ],
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.errors).toBeDefined();
    });
});
