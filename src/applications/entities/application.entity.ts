import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Unique, Column } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Vacancy } from '../../vacancies/entities/vacancy.entity';

@Entity('applications')
@Unique(['user', 'vacancy']) // Prevent duplicate applications
export class Application {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column()
    vacancyId: string;

    @ManyToOne(() => User, (user) => user.applications)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Vacancy, (vacancy) => vacancy.applications)
    @JoinColumn({ name: 'vacancyId' })
    vacancy: Vacancy;

    @CreateDateColumn()
    appliedAt: Date;
}
