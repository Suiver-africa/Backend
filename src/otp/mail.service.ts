import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: true, // true if using port 465
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

 async sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
  console.log('Sending email with the following details:');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('HTML:', html);

  return this.transporter.sendMail({
    from: this.configService.get('SMTP_USER'),
    to,
    subject,
    html,
  });
}

}
