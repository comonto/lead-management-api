export class CrmService {
    public async syncLead(leadData: any): Promise<{ status: 'success' | 'failed', message: string }> {
      return new Promise(resolve => {
        setTimeout(() => {
          const isSuccess = Math.random() > 0.1; // 90% di successo, 10% di fallimento per simulazione
          if (isSuccess) {
            console.log(`[CRM Mock] Lead sincronizzato con successo: ${leadData.phoneNumber}`);
            resolve({ status: 'success', message: 'Lead sincronizzato con il CRM esterno.' });
          } else {
            console.warn(`[CRM Mock] Errore nella sincronizzazione del lead: ${leadData.phoneNumber}`);
            resolve({ status: 'failed', message: 'Errore durante la sincronizzazione con il CRM esterno.' });
          }
        }, 500);
      });
    }
  }