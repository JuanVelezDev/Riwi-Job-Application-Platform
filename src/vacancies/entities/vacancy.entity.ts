import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Application } from '../../applications/entities/application.entity';

export enum VacancyModality {
    REMOTE = 'remote',
    HYBRID = 'hybrid',
    ONSITE = 'presential',
}

export enum VacancyStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity('vacancies')
export class Vacancy {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column('text') // Storing as simple string for now, could be JSON or relation
    technologies: string;

    @Column()
    seniority: string;

    @Column()
    location: string;

    @Column({
        type: 'enum',
        enum: VacancyModality,
    })
    modality: VacancyModality;

    @Column()
    salaryRange: string;

    @Column()
    company: string;

    @Column('int')
    maxApplicants: number;

    @Column({
        type: 'enum',
        enum: VacancyStatus,
        default: VacancyStatus.ACTIVE,
    })
    status: VacancyStatus;

    @OneToMany(() => Application, (application) => application.vacancy)
    applications: Application[];

    @CreateDateColumn()
    createdAt: Date;
}
