export  class MinuteFormModel
{
  meetingId: number;
  attachmentId: number;
  constructor(data){
    Object.assign(this,data);
  }
}

export  class MinuteConfirmFormModel
{
  meetingId: number;
  users: number[];
  confirmDate: Date;
  constructor(data){
    Object.assign(this,data);
  }
}

export  class MinuteHistoryModel
{
  meetingId: number;
  realFileName: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  createdUser: string;
  createdDate: Date;
  constructor(data){
    Object.assign(this,data);
  }
}

export  class MinuteConfirmModel
{
  name: string;
  email: string;
  isConfirm: boolean;
  confirmDate: Date;
  constructor(data){
    Object.assign(this,data);
  }
}
