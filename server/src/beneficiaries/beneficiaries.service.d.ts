import { PrismaService } from '../prisma/prisma.service';
import { CreateBeneficiaryDto } from '../user/dto/create-beneficiary.dto';
export declare class BeneficiariesService {
    private prisma;
    constructor(prisma: PrismaService);
    add(userId: string, dto: CreateBeneficiaryDto): Promise<any>;
    list(userId: string): Promise<any>;
}
