import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);

    /**
     * Notify admin of a critical event (e.g. payout failure).
     * TODO: wire up to email/Slack/SMS as needed.
     */
    async notifyAdmin(message: string, error?: any): Promise<void> {
        this.logger.error(`[ADMIN ALERT] ${message}`, error?.stack ?? error);
        // TODO: send email / Slack webhook / SMS to admin
    }
}
