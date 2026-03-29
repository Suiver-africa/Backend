import { UserSecurityService } from './user-security.service';
import { SetPinDto } from './dto/set-pin.dto';
import { VerifyPinDto } from './dto/verify-pin.dto';
export declare class UserSecurityController {
    private svc;
    constructor(svc: UserSecurityService);
    setPin(dto: SetPinDto): Promise<{
        success: boolean;
    }>;
    verifyPin(dto: VerifyPinDto): Promise<{
        success: boolean;
    }>;
}
