export class MailServerConfigModel {
    senderName: string;
    senderEmail: string;
    smtpHost: string;
    smtpAuthen: boolean;
    smtpUser: string;
    smtpPass: string;
    smtpPort: number;
    smtpSecure: boolean;
    constructor(data) {
        Object.assign(this, data);
    }
}
