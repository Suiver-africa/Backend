import { PaymentLinksService } from './payment-links.service';
import { CreatePaymentLinkDto } from '../user/dto/create-payment-link.dto';
export declare class PaymentLinksController {
    private svc;
    constructor(svc: PaymentLinksService);
    create(req: any, dto: CreatePaymentLinkDto): Promise<{
        amount: number | null;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        status: import(".prisma/client").$Enums.PaymentLinkStatus;
        description: string | null;
        autoTransferBank: boolean;
        slug: string;
        title: string;
        invoiceNumber: string | null;
        dueDate: Date | null;
        acceptedMethods: import(".prisma/client").$Enums.PaymentLinkPayMethod;
        acceptedAssets: string[];
        depositWalletId: string | null;
        bankInstructions: string | null;
        expiresAt: Date | null;
        autoConvertToNgn: boolean;
        settleBankId: string | null;
    }>;
}
