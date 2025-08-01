export class AgendumExportModel {
  meetingNo: string;
  title: string;
  startDate: Date;
  endDate: Date;
  items: AgendumItemModel[] = [];
  constructor(data) {
    Object.assign(this, data);
    if (data.items?.length > 0) {
      this.items = data.items.map(x => new AgendumItemModel(x));
    }
  }
}

export class AgendumItemModel {
  id: number;
  level: number;
  agendaNo: string;
  owner: string;
  status: string;
  title: string;
  useTime: number;
  objective: string;
  confidentialLevel: string;
  agendaTeams: string[] = [];
  presenters: string[] = [];
  attachments: string[] = [];
  presenterAttachments: string[] = [];
  bookingDate: Date;
  approvers: AgendumBookingApproverModel[] = [];
  constructor(data) {
    Object.assign(this, data);
    if(data.approvers?.length > 0){
      this.approvers = data.approvers.map(x => new AgendumBookingApproverModel(x));
    }
  }
}

export class AgendumBookingApproverModel {
  name: string;
  status: string;
  description: string;
  approveDate: Date;
  constructor(data) {
    Object.assign(this, data);
  }
}
