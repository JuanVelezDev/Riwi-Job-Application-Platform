import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { Vacancy, VacancyStatus } from '../vacancies/entities/vacancy.entity';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationsService {
    constructor(
        @InjectRepository(Application)
        private applicationsRepository: Repository<Application>,
        @InjectRepository(Vacancy)
        private vacanciesRepository: Repository<Vacancy>,
    ) { }

    async create(userId: string, createApplicationDto: CreateApplicationDto): Promise<Application> {
        const { vacancyId } = createApplicationDto;

        // Check 1: User applied max 3 times?
        // Note: Assuming 'active' logic could be refined but prompt says "not post to more than 3 active vacancies".
        // I'll count all applications to active vacancies.
        const userApplications = await this.applicationsRepository.find({
            where: { userId },
            relations: ['vacancy'],
        });

        const activeApplicationsCount = userApplications.filter(app => app.vacancy.status === VacancyStatus.ACTIVE).length;
        if (activeApplicationsCount >= 3) {
            throw new BadRequestException('You cannot apply to more than 3 active vacancies.');
        }

        // Check 2: Already applied?
        const alreadyApplied = userApplications.some(app => app.vacancyId === vacancyId);
        if (alreadyApplied) {
            throw new ConflictException('You have already applied to this vacancy.');
        }

        // Check 3: Vacancy exists and active?
        const vacancy = await this.vacanciesRepository.findOne({
            where: { id: vacancyId },
            relations: ['applications']
        });

        if (!vacancy) throw new NotFoundException('Vacancy not found');
        if (vacancy.status !== VacancyStatus.ACTIVE) throw new BadRequestException('Vacancy is not active.');

        // Check 4: Capacity?
        if (vacancy.applications.length >= vacancy.maxApplicants) {
            throw new BadRequestException('Vacancy is full.');
        }

        // Create Application
        const application = this.applicationsRepository.create({
            userId,
            vacancyId,
        });

        return this.applicationsRepository.save(application);
    }

    async findAllByVacancy(vacancyId: string): Promise<Application[]> {
        return this.applicationsRepository.find({
            where: { vacancyId },
            relations: ['user'],
        });
    }

    async findAllByUser(userId: string): Promise<Application[]> {
        return this.applicationsRepository.find({
            where: { userId },
            relations: ['vacancy']
        });
    }
}
