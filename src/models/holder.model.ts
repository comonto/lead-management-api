import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Lead } from './lead.model';

export enum HolderType {
    FIRST = 'first',
    SECOND = 'second',
}

@Entity('holder')
export class Holder {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        type: 'enum',
        enum: HolderType,
        nullable: false,
    })
    type!: HolderType;

    @Column({ type: 'varchar', length: 100, nullable: false })
    firstName!: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    lastName!: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    email!: string;

    @Column({ type: 'date', nullable: false })
    dateOfBirth!: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    monthlyIncome!: number;

    @Column({ type: 'int', nullable: false, default: 12 })
    incomeBreakdown!: 12 | 13 | 14;

    @ManyToOne(() => Lead, lead => lead.holders, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'leadId' })
    lead!: Lead;

    @Column()
    leadId!: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;
}