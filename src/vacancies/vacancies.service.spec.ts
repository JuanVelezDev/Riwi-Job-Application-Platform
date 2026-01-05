import { Test, TestingModule } from '@nestjs/testing';
import { VacanciesService } from './vacancies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vacancy } from './entities/vacancy.entity';

describe('VacanciesService', () => {
    let service: VacanciesService;

    const mockRepository = {
        create: jest.fn().mockImplementation((dto) => dto),
        save: jest.fn().mockImplementation((vacancy) => Promise.resolve({ id: 'uuid', ...vacancy })),
        find: jest.fn().mockResolvedValue([]),
        findOne: jest.fn().mockImplementation((query) => Promise.resolve({ id: 'uuid', ...query.where })),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VacanciesService,
                {
                    provide: getRepositoryToken(Vacancy),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<VacanciesService>(VacanciesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a vacancy', async () => {
        const dto = { title: 'Test', maxApplicants: 5 } as any;
        expect(await service.create(dto)).toEqual({
            id: 'uuid',
            ...dto,
        });
    });

    it('should update vacancy status', async () => {
        const result = await service.updateStatus('uuid', 'inactive' as any);
        expect(result.status).toBe('inactive');
    });

    it('should update vacancy details', async () => {
        const dto = { title: 'Updated Title' };
        // We need to mock the merge behavior slightly better or rely on the save return
        // Since we mocked save to return input spread on existing, it should work if we verify arguments
        // But our current mockRepository.save returns input.
        // Let's assume standard behavior: update calls findOne then save.

        // Refine mock for this test if needed, but the basic mock might suffice if we assume merge works (it's called on repo)
        // Wait, repository.merge is NOT mocked in initial setup! We need to add it.
        mockRepository['merge'] = jest.fn().mockImplementation((entity, dto) => ({ ...entity, ...dto }));

        const result = await service.update('uuid', dto);
        expect(result.title).toBe('Updated Title');
    });
});
