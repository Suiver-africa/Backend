import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    sendMail({ to, subject, html }: {
        to: string;
        subject: string;
        html: string;
    }): Promise<any>;
}
