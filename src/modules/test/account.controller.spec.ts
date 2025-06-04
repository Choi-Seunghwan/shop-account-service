import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from 'src/modules/account/account.controller';
import { AccountService } from 'src/modules/account/account.service';
import { AuthorizationService } from '@choi-seunghwan/authorization';
import { VerificationService } from 'src/modules/verification/verification.service';
import { AccountRepository } from 'src/modules/account/account.repository';

describe('AccountController', () => {
  let controller: AccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountService,
          useValue: {},
        },
        {
          provide: AccountRepository,
          useValue: {},
        },
        {
          provide: VerificationService,
          useValue: {},
        },
        {
          provide: AuthorizationService,
          useValue: {
            // verifyAccessToken: jest.fn().mockResolvedValue({ id: 1 }),
          },
        },
      ],
    }).compile();

    controller = module.get<AccountController>(AccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
