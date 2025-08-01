import { AgendaRefAttachmentModel } from './agenda-ref-attachment.model';
import { AttachmentHistoryModel } from './attachment-history.model';
import { MeetingAttachmentModel, AttachmentFormModel } from './attachment.model';
import { UserListModel } from './user.model';

export class MeetingAgendaModel {
    id: number;
    uid: string;
    pos: number;
    meetingId: number;
    parentId: number;
    agendaRequestItemId: number;
    agendaNo: string;
    title: string;
    description: string;
    startTime: Date;
    useTime: number;
    agendaReserveName: string;
    agendaReserveDate: Date;
    minuteRequestStatus: string;
    isAttachment: boolean;
    isVote: boolean;
    isVoteOpen: boolean;
    isConfirm: boolean;
    isCustom: boolean;
    createdDate: Date;
    createdIp: string;
    createdUser: string;
    updatedDate: Date;
    updatedIp: string;
    updatedUser: string;
    voteNo: number = 0;
    voteYes: number = 0;
    noVote: number = 0;
    level: number;
    presenters: UserListModel[] = [];
    presenterAttachments: MeetingAttachmentModel[] = [];
    attachments: MeetingAttachmentModel[] = [];
    excludeUsers: UserListModel[] = [];
    subAgendas: MeetingAgendaModel[] = [];
    refAttachments: AgendaRefAttachmentModel[] = [];
    attachmentHistories: AttachmentHistoryModel[] = [];

    constructor(data) {
        Object.assign(this, data);
        if (data.subAgendas && Array.isArray(data.subAgendas) && data.subAgendas.length > 0) {
            this.subAgendas = data.subAgendas.map(c => new MeetingAgendaModel(c));
        }
        if (data.presenters && Array.isArray(data.presenters) && data.presenters.length > 0) {
            this.presenters = data.presenters.map(c => new UserListModel(c));
        }
        if (data.presenterAttachments && Array.isArray(data.presenterAttachments) && data.presenterAttachments.length > 0) {
            this.presenterAttachments = data.presenterAttachments.map(c => new MeetingAttachmentModel(c));
        }
        if (data.attachments && Array.isArray(data.attachments) && data.attachments.length > 0) {
            this.attachments = data.attachments.map(c => new MeetingAttachmentModel(c));
        }
        if (data.excludeUsers && Array.isArray(data.excludeUsers) && data.excludeUsers.length > 0) {
            this.excludeUsers = data.excludeUsers.map(c => new UserListModel(c));
        }
        if (data.refAttachments && Array.isArray(data.refAttachments) && data.refAttachments.length > 0) {
            this.refAttachments = data.refAttachments.map(c => new AgendaRefAttachmentModel(c));
        }
        if (data.attachmentHistories && Array.isArray(data.attachmentHistories) && data.attachmentHistories.length > 0) {
            this.attachmentHistories = data.attachmentHistories.map(c => new AttachmentHistoryModel(c));
        }

    }
}

export class MeetingAgendaListModel {
    id: number;
    uid: string;
    level: number;
    pos: number;
    meetingId: number;
    parentId: number;
    agendaRequestItemId: number;
    agendaNo: string;
    title: string;
    description: string;
    startTime: Date;
    useTime: number;
    isAttachment: boolean;
    isVote: boolean;
    isVoteOpen: boolean;
    isConfirm: boolean;
    isCustom: boolean;
    createdDate: Date;
    createdIp: string;
    createdUser: string;
    updatedDate: Date;
    updatedIp: string;
    updatedUser: string;
    constructor(data) {
        Object.assign(this, data);
    }
}
export class MeetingAgendaFormModel {
    id: number;
    pos: number;
    meetingId: number;
    parentId: number;
    isVote: boolean;
    isVoteOpen: boolean;
    isConfirm: boolean;
    isCustom: boolean;
    agendaNo: string;
    title: string;
    description: string;
    useTime: number;
    excludeUsers: number[];
    presenters: number[];
    presenterDocuments: AttachmentFormModel[];
    attachments: AttachmentFormModel[];
    attachmentReferences: number[];
    constructor(data) {
        Object.assign(this, data);
    }
}

export class MeetingAgendaAttachmentFormModel {
    id: number;
    uid: string;
    attachmentType: string;
    documentTypeId: number;
    agendaId: number;
    attachmentId: number;
    pos: number;
    constructor(data) {
        Object.assign(this, data);
    }
}

export class MeetingAgendaAttachmentPermissionFormModel {
    id: number;
    agendaId: number;
    attachmentId: number;
    userId: number;
    isRead: boolean;
    isDownload: boolean;
    constructor(data) {
        Object.assign(this, data);
    }
}
