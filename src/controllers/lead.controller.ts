import { Request, Response, NextFunction } from 'express';
import { LeadService } from '../services/lead.service';
import { LeadDTO } from '../dto/lead.dto';

export class LeadController {
    private leadService: LeadService;

    constructor() {
        this.leadService = new LeadService();
    }

    public async createOrUpdateLead(req: Request, res: Response, next: NextFunction) {
        try {
            const leadData: LeadDTO = req.body;
            const result = await this.leadService.processLead(leadData);
            res.status(result.status === 'created' ? 201 : 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}