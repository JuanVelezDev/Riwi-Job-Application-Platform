import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';

describe('UsersService', () => {
    let service: UsersService;
    let mockRepository;

    beforeEach(async () => {
        mockRepository = {
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((user) => Promise.resolve({ id: 'uuid', ...user })),
            find: jest.fn().mockResolvedValue([{ id: 'uuid', name: 'Test' }]),
            findOne: jest.fn().mockImplementation((query) => {
                // Mock findOne for ID and Email
                if (query.where.email === 'test@example.com') return Promise.resolve({ id: 'uuid', email: 'test@example.com', password: 'hash' });
                if (query.where.id === 'uuid') return Promise.resolve({ id: 'uuid', name: 'Test' });
                return Promise.resolve(null);
            }),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a user', async () => {
        const dto = { name: 'Test', email: 'new@example.com', password: 'password', role: UserRole.CODER };
        const result = await service.create(dto);
        expect(result).toHaveProperty('id', 'uuid');
        expect(result.email).toBe(dto.email);
        expect(result.password).not.toBe(dto.password); // Password should be hashed
        expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should find all users', async () => {
        const result = await service.findAll();
        expect(result).toHaveLength(1);
    });

    it('should find one user by id', async () => {
        const result = await service.findOne('uuid');
        expect(result).toBeDefined();
        expect(result.id).toBe('uuid');
    });

    it('should find user by email', async () => {
        const result = await service.findByEmail('test@example.com');
        expect(result).toBeDefined();
        expect(result.email).toBe('test@example.com');
    });
});
