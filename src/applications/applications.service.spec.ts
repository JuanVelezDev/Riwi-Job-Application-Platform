import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsService } from './applications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { Vacancy, VacancyStatus } from '../vacancies/entities/vacancy.entity';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('ApplicationsService', () => {
    let service: ApplicationsService;
    let mockApplicationsRepo;
    let mockVacanciesRepo;

    beforeEach(async () => {
        mockApplicationsRepo = {
            find: jest.fn(),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((app) => Promise.resolve({ id: 'app-uuid', ...app })),
        };

        mockVacanciesRepo = {
            findOne: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ApplicationsService,
                {
                    provide: getRepositoryToken(Application),
                    useValue: mockApplicationsRepo,
                },
                {
                    provide: getRepositoryToken(Vacancy),
                    useValue: mockVacanciesRepo,
                },
            ],
        }).compile();

        service = module.get<ApplicationsService>(ApplicationsService);
    });

    it('should prevent applying if vacancy is not active', async () => {
        mockApplicationsRepo.find.mockResolvedValue([]);
        mockVacanciesRepo.findOne.mockResolvedValue({ status: VacancyStatus.INACTIVE, applications: [] });

        await expect(service.create('user', { vacancyId: 'v1' }))
            .rejects.toThrow(BadRequestException);
    });

    it('should prevent applying if double application', async () => {
        mockApplicationsRepo.find.mockResolvedValue([{ vacancyId: 'v1', vacancy: { status: VacancyStatus.ACTIVE } }]);

        await expect(service.create('user', { vacancyId: 'v1' }))
            .rejects.toThrow(ConflictException);
    });

    it('should apply successfully if all checks pass', async () => {
        mockApplicationsRepo.find.mockResolvedValue([]);
        mockVacanciesRepo.findOne.mockResolvedValue({
            id: 'v1',
            status: VacancyStatus.ACTIVE,
            maxApplicants: 10,
            applications: []
        });

        const result = await service.create('user', { vacancyId: 'v1' });
        expect(result).toEqual({ id: 'app-uuid', userId: 'user', vacancyId: 'v1' });
    });
});
