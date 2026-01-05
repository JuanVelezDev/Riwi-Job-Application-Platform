import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn().mockImplementation((dto) => Promise.resolve({ access_token: 'token', user: { ...dto } })),
    register: jest.fn().mockImplementation((dto) => Promise.resolve({ access_token: 'token', user: { ...dto, id: 'id' } })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return token on login', async () => {
    const result = await controller.login({ email: 'test@test.com', password: 'pass' });
    expect(result).toHaveProperty('access_token');
  });
});
