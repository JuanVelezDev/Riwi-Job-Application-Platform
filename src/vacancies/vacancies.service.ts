import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Vacancy, VacancyStatus } from './entities/vacancy.entity';
import { CreateVacancyDto } from './dto/create-vacancy.dto';

@Injectable()
export class VacanciesService {
    constructor(
        @InjectRepository(Vacancy)
        private vacanciesRepository: Repository<Vacancy>,
    ) { }

    async create(createVacancyDto: CreateVacancyDto): Promise<Vacancy> {
        const vacancy = this.vacanciesRepository.create(createVacancyDto);
        return this.vacanciesRepository.save(vacancy);
    }

    async findAll(search?: string, seniority?: string): Promise<Vacancy[]> {
        const query = this.vacanciesRepository.createQueryBuilder('vacancy')
            .leftJoinAndSelect('vacancy.applications', 'application')
            .loadRelationCountAndMap('vacancy.applicantsCount', 'vacancy.applications')
            .where('vacancy.status = :status', { status: VacancyStatus.ACTIVE });

        if (search) {
            query.andWhere(
                new Brackets((qb) => {
                    qb.where('LOWER(vacancy.title) LIKE LOWER(:search)', { search: `%${search}%` })
                        .orWhere('LOWER(vacancy.technologies) LIKE LOWER(:search)', { search: `%${search}%` })
                        .orWhere('LOWER(vacancy.seniority) LIKE LOWER(:search)', { search: `%${search}%` });
                }),
            );
        }

        if (seniority) {
            console.log(`Filtering by seniority: ${seniority}`); // Debug
            // Use strict equality for filter dropdown to ensure only exact matches are returned
            query.andWhere('vacancy.seniority = :seniority', { seniority });
        }

        return query.getMany();
    }

    async findOne(id: string): Promise<Vacancy> {
        const vacancy = await this.vacanciesRepository.findOne({ where: { id } });
        if (!vacancy) throw new NotFoundException('Vacancy not found');
        return vacancy;
    }

    async updateStatus(id: string, status: VacancyStatus): Promise<Vacancy> {
        const vacancy = await this.findOne(id);
        vacancy.status = status;
        return this.vacanciesRepository.save(vacancy);
    }

    async update(id: string, updateVacancyDto: any): Promise<Vacancy> {
        const vacancy = await this.findOne(id);
        // Merge updates
        const updated = this.vacanciesRepository.merge(vacancy, updateVacancyDto);
        return this.vacanciesRepository.save(updated);
    }

    // Helper for Application Logic
    async incrementApplicants(id: string): Promise<void> {
        // Logic can be handled via count query in application service or explicit counter here.
        // For now, relies on count relations or separate query.
        // This method is a placeholder if we decide to store "currentApplicants" on Vacancy entity for performance.
        // Given the assessment requirements, relying on Applications table count is safer for consistency.
    }
}
