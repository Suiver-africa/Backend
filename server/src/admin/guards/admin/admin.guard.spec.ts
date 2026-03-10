import { JwtService } from '@nestjs/jwt';
import { AdminGuard } from './admin.guard';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = {
      verifyAsync: jest.fn(),
    } as any;
    guard = new AdminGuard(jwtService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
