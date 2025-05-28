import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Holder } from './holder.model';
import { Simulation } from './simulation.model';

@Entity('lead')
export class Lead {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
    phoneNumber!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    mortgageAmount!: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    homeValue!: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    city!: string;

    @OneToMany(() => Holder, holder => holder.lead, {
        cascade: true,
    })
    holders!: Holder[];

    @OneToMany(() => Simulation, simulation => simulation.lead)
    simulations!: Simulation[];

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;
}