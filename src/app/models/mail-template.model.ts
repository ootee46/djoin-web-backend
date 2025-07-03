export class MailTemplateModel {
    id: number;
    name: string;
    mailSubject: string;
    mailBody: string;
    updatedDate: Date;
    updatedUser: string;
    updatedIp: string;
    constructor(data) {
        Object.assign(this, data);
    }
}
