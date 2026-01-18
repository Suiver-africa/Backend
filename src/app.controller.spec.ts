import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './app.controller';
import { PaymentsService } from './payments/payments.service';
import { CryptoService } from './crypto/crypto.service';

describe('PaymentController', () => {
  let paymentController: PaymentController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentsService,
          useValue: {},
        },
        {
          provide: CryptoService,
          useValue: {},
        },
      ],
    }).compile();

    paymentController = app.get<PaymentController>(PaymentController);
  });

  it('should be defined', () => {
    expect(paymentController).toBeDefined();
  });
});
