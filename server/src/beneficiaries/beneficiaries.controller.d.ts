import { BeneficiariesService } from './beneficiaries.service';
import { CreateBeneficiaryDto } from '../user/dto/create-beneficiary.dto';
export declare class BeneficiariesController {
    private svc;
    constructor(svc: BeneficiariesService);
    add(req: any, dto: CreateBeneficiaryDto): Promise<any>;
    list(req: any): Promise<any>;
}
