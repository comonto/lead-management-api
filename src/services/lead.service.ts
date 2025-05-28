import { AppDataSource } from '../config/database';
import { Lead } from '../models/lead.model';
import { Holder } from '../models/holder.model';
import { Simulation } from '../models/simulation.model';
import { LeadDTO } from '../dto/lead.dto';
import { CrmService } from './crm.service';
import { generateHash } from '../utils/hash.util';
import { MoreThanOrEqual } from 'typeorm';

export class LeadService {
    private leadRepository = AppDataSource.getRepository(Lead);
    private intestatarioRepository = AppDataSource.getRepository(Holder);
    private simulationRepository = AppDataSource.getRepository(Simulation);
    private crmService: CrmService; // Ora è una proprietà, non istanziata qui

    constructor(crmService?: CrmService) { // Accetta un'istanza opzionale
      this.crmService = crmService || new CrmService(); // Usa quella fornita o ne crea una di default
    }
    public async processLead(leadDto: LeadDTO): Promise<any> {
        const { phoneNumber, holders, ...leadData } = leadDto;
        
        let lead: Lead | null;

        let status: 'created' | 'updated';

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {

            lead = await queryRunner.manager.findOne(Lead, {
                where: { phoneNumber },
                lock: { mode: 'pessimistic_write' } 
            });

            if (lead) {
                // Aggiorna lead esistente
                status = 'updated';
                Object.assign(lead, leadData);
                await queryRunner.manager.save(lead);

                // Gestione degli intestatari esistenti/nuovi/rimossi
                const existingOwners = await this.intestatarioRepository.find({ where: { leadId: lead.id } });
                const ownersToDelete = existingOwners.filter(eo => !holders.some(newO => newO.email === eo.email));
                const ownersToCreate = holders.filter(newO => !existingOwners.some(eo => eo.email === newO.email));
                const ownersToUpdate = holders.filter(newO => existingOwners.some(eo => eo.email === newO.email));

                if (ownersToDelete.length > 0) {
                    await queryRunner.manager.remove(ownersToDelete);
                }

                for (const newOwnerData of ownersToCreate) {
                    const newIntestatario = this.intestatarioRepository.create({ ...newOwnerData, lead });
                    await queryRunner.manager.save(newIntestatario);
                }

                for (const ownerUpdateData of ownersToUpdate) {
                    const existingOwner = existingOwners.find(eo => eo.email === ownerUpdateData.email);
                    if (existingOwner) {
                        Object.assign(existingOwner, ownerUpdateData);
                        await queryRunner.manager.save(existingOwner);
                    }
                }

            } else {
                // Crea nuovo lead
                status = 'created';
                lead = this.leadRepository.create({ phoneNumber, ...leadData });
                await queryRunner.manager.save(lead);

                 // A questo punto, 'lead' è appena stato creato e salvato, quindi non è null
                const newOwners = holders.map(ownerData =>
                    this.intestatarioRepository.create({ ...ownerData, lead: lead! }) // Usa l'asserzione ! per dire a TS che non è null
                );
                await queryRunner.manager.save(newOwners);
            }

            // Logica per la simulazione
            const requestHash = generateHash(leadDto); // Hash dell'intera richiesta DTO
            const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000); // 10 minuti fa

            const recentSimulation = await this.simulationRepository.findOne({
                where: {
                    lead: { id: lead.id },
                    requestHash: requestHash,
                    timestamp: MoreThanOrEqual(tenMinutesAgo)
                }
            });
            // Note: Il filtro per data con TypeORM può essere un po' più complesso a seconda del driver.
            // Questa è una simulazione semplificata che potrebbe richiedere un custom find operator o query builder.
            // Per una query più robusta: await queryRunner.manager.query(`SELECT * FROM simulations WHERE "leadId" = $1 AND "requestHash" = $2 AND timestamp >= $3`, [lead.id, requestHash, tenMinutesAgo]);

            if (!recentSimulation) {
                const simulation = this.simulationRepository.create({ lead, requestHash });
                await queryRunner.manager.save(simulation);
            } else {
                console.log(`[Simulation] Richiesta simile già registrata negli ultimi 10 minuti per lead ${lead.id}. Saltata.`);
            }

            await queryRunner.commitTransaction();

            // Sincronizzazione CRM (fuori dalla transazione del DB principale se non strettamente legata)
            const crmSyncResult = await this.crmService.syncLead({ id: lead.id, phoneNumber, ...leadData, holders });

            return {
                message: `Lead ${status} successfully`,
                leadId: lead.id,
                status: status,
                crmSyncStatus: crmSyncResult.status
            };

        } catch (err) {
            await queryRunner.rollbackTransaction();
            console.error("Errore durante l'elaborazione del lead:", err);
            throw err; // Rilancia l'errore per la gestione errori centrale
        } finally {
            await queryRunner.release();
        }
    }
}