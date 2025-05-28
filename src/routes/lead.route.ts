// src/routes/lead.routes.ts
import { Router } from 'express';
import { LeadController } from '../controllers/lead.controller';
import { validationMiddleware } from '../middlewares/validationMiddleware';
import { LeadDTO } from '../dto/lead.dto';

const router = Router();
const leadController = new LeadController();

router.post(
    '/lead',
    validationMiddleware(LeadDTO),
    leadController.createOrUpdateLead.bind(leadController)
);

export default router;