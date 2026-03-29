import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private payments;
    constructor(payments: PaymentsService);
    airtime(req: any, body: {
        phone: string;
        amount: number;
    }): Promise<any>;
}
