import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Lead } from './lead.model';

@Entity('simulation')
export class Simulation {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 64, nullable: false })
    requestHash!: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    timestamp!: Date;

    @ManyToOne(() => Lead, lead => lead.simulations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'leadId' })
    lead!: Lead;

    @Column()
    leadId!: string;
}