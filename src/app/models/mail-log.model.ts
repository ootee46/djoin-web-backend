export class MailLogModel{
  id: string;
  templateName: string;
  refrenceId: string;
  mailFrom: string;
  mailTo: string;
  mailCc: string;
  subject: string;
  body: string;
  isSuccess: boolean;
  errorMessage: string;
  createdDate: string;
  constructor(data){
    Object.assign(this,data);
  }
}
