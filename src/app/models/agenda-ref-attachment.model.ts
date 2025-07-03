import { MeetingAttachmentModel } from './attachment.model';

export class AgendaRefAttachmentModel {
    agendaId: number;
    meetingId: number;
    meetingDate: Date;
    meetingName: string;
    isOpen: boolean = false;
    meetingNo: string;
    agendaName: string;
    attachments: MeetingAttachmentModel[] = [];
    constructor(data: any) {
        Object.assign(this,data);
        if(data.attachments && Array.isArray(data.attachments) && data.attachments.length > 0)
        {
            this.attachments = data.attachments.map(c=>new MeetingAttachmentModel(c));
        }
    }
}
