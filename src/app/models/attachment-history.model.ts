export class AttachmentHistoryModel{
  id: number;
  agendaId: number;
  meetingId: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  realFileName: string;
  salt: string;
  oldFileName: string;
  oldFileType: string;
  oldFileSize: number;
  oldFileUrl: string;
  oldRealFileName: string;
  oldSalt: string;
  action: number;
  createdDate: Date;
  createdIp: string;
  createdUser: string;
  constructor(data){
    Object.assign(this,data);
  }
}
