import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Application } from '../../applications/entities/application.entity';

export enum UserRole {
    ADMIN = 'admin',
    GESTOR = 'gestor',
    CODER = 'coder',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false }) // Password should not be returned by default
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CODER,
    })
    role: UserRole;

    @OneToMany(() => Application, (application) => application.user)
    applications: Application[];

    @CreateDateColumn()
    createdAt: Date;
}
