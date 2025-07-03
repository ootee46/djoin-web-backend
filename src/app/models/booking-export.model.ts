export class BookingExportModel {
  meetingNo: string;
  title: string;
  startDate: Date;
  endDate: Date;
  items: BookingItemModel[];
  constructor(data) {
    Object.assign(this, data);
    if (data.items?.length > 0) {
      this.items = data.items.map(x => new BookingItemModel(x));
    }
  }
}
export class BookingItemModel {
  id: number;
  owner: string;
  agendaNo: string;
  title: string;
  useTime: number;
  status: string;
  objective: string;
  confidentialLevel: string;
  agendaTeams: string[];
  presenters: string[];
  attachments: string[];
  presenterAttachments: string[];
  bookingDate: Date;
  approvers: BookingHistoryModel[];
  constructor(data) {
    Object.assign(this, data);
    if (data.items?.length > 0) {
      this.approvers = data.items.map(x => new BookingHistoryModel(x));
    }
  }
}
export class BookingHistoryModel {
  description: string;
  name: string;
  status: string;
  approveDate: Date;
  constructor(data) {
    Object.assign(this, data);
  }
}
