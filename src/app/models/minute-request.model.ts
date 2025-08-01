import { AttachmentModel } from './attachment.model';
import { MeetingAgendaModel } from './meeting-agenda.model';

export class MinuteRequestFormModel
{
  agendaId: number ;
  attachment: AttachmentModel ;
  constructor(data){
    Object.assign(this,data);
  }
}

export class MinuteRequestApproverModel
{
  stepName: string ;
  approverName: string ;
  actionDate: Date ;
  action: string ;
  remark: string ;
  fileName: string ;
  fileUrl: string ;
  attachments: AttachmentModel[] = [];
  constructor(data){
    Object.assign(this,data);
  }
}

export class MinuteRequestListModel
{

  id: number ;
  documentNo: string ;
  userId: number ;
  meetingId: number ;
  meetingRoomName: string ;
  meetingTypeName: string ;
  meetingSubTypeName: string ;
  agendaApproverFlowName: string ;
  agendaObjectiveName: string ;
  agendaConfidentialName: string ;
  meetingTitle: string ;
  requesterName: string ;
  startDate: Date ;
  endDate: Date ;
  agendaObjectiveId: number ;
  agendaConfidentialId: number ;
  agendaOwnerName: string;
  title: string ;
  description: string ;
  isApproved: boolean ;
  approveStatus: string ;
  fileName: string ;
  fileUrl: string ;
  submittedDate: Date;
  createdDate: Date ;
  createdIp: string ;
  createdUser: string ;
  updatedDate: Date ;
  updatedIp: string ;
  updatedUser: string ;
  constructor(data){
    Object.assign(this,data);
  }
}

export class MinuteAttachmentFormModel {
  id: number;
  uid: string;
  minuteRequestId: number;
  attachmentId: number;
  pos: number;
  constructor(data) {
      Object.assign(this, data);
  }
}

export class MinuteRequestModel
{
  minuteRequest: MinuteRequestListModel ;
  agenda: MeetingAgendaModel ;
  reserveRejectType: number ;
  histories: MinuteRequestApproverModel[];
  constructor(data){
    Object.assign(this,data);
    if(data.histories && data.histories.length > 0){
      this.histories = data.histories.map(c=>new MinuteRequestApproverModel(c));
    }
  }
}
