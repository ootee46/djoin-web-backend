
import { UserModel } from './user.model';
export class AgendaRequestItemModel {

    id: number;
    documentNo: string;
    requestType: number;
    userId: number;
    meetingId: number;
    meetingRoomName: string;
    meetingTypeName: string;
    meetingSubTypeName: string;
    agendaApproverFlowName: string;
    agendaObjectiveName: string;
    agendaConfidentialName: string;
    meetingTitle: string;
    startDate: Date;
    endDate: Date;
    presenters: UserModel[] = [];
    excludeUsers: UserModel[] = [];
    teams: UserModel[] = [];
    isOwner: boolean = false;
    isAgendaWorkingTeam: boolean = false;
    isEdit: boolean = false;
    approvers: AgendaRequestItemApproveModel[] = [];
    steps: AgendaRequestStep[] = [];
    presenterAttachments: AgendaRequestAttachmentModel[] = [];
    attachments: AgendaRequestAttachmentModel[] = [];
    agendaObjectiveId: number;
    agendaConfidentialId: number;
    requesterName: string;
    title: string;
    description: string;
    useTime: number;
    isVote: boolean;
    isVoteOpen: boolean;
    isConfirm: boolean;
    isReview: boolean;
    isReviewed: boolean;
    isSubmitted: boolean;
    isApproved: boolean;
    approveStatus: string;
    reserveRejectType: number;
    submittedDate: Date;
    createdDate: Date;
    createdIp: string;
    createdUser: string;
    updatedDate: Date;
    updatedIp: string;
    updatedUser: string;
    attendees: UserModel[] = [];
    bookingDetail: string;

    constructor(data) {
        Object.assign(this, data);
        if(data.attendees && data.attendees.length > 0){
            this.attendees = data.attendees.map(c=>new UserModel(c));
        }
        if(data.approvers && data.approvers.length > 0){
            this.approvers = data.approvers.map(c=>new AgendaRequestItemApproveModel(c));
        }
        if(data.steps && data.steps.length > 0){
            this.steps = data.steps.map(c=>new AgendaRequestStep(c));
        }
        if(data.presenterAttachments && data.presenterAttachments.length > 0){
            this.presenterAttachments = data.presenterAttachments.map(c=>new AgendaRequestAttachmentModel(c));
        }
        if(data.attachments && data.attachments.length > 0){
            this.attachments = data.attachments.map(c=>new AgendaRequestAttachmentModel(c));
        }
    }

}


export class AgendaRequestStep{
    stepName: string;
    responseNames: string[];
    constructor(data) {
        Object.assign(this, data);
    }
}
export class AgendaRequestModel {
    id: number;
    documentNo: string;
    userId: number;
    createdDate: Date;
    createdIp: string;
    createdUser: string;
    updatedDate: Date;
    updatedIp: string;
    updatedUser: string;
    agendaRequestItems: AgendaRequestItemModel[] = [];
    constructor(data) {
        Object.assign(this, data);
        if(data.agendaRequestItems && data.agendaRequestItems.length > 0){
            this.agendaRequestItems = data.agendaRequestItems.map(c=>new AgendaRequestItemModel(c));
        }
    }
}


export class AgendaRequestListModel {
    id: number;
    documentNo: string;
    userId: number;
    createdDate: Date;
    createdIp: string;
    createdUser: string;
    updatedDate: Date;
    updatedIp: string;
    updatedUser: string;
    agendaRequestItems: AgendaRequestItemListModel[] = [];
    constructor(data) {
        Object.assign(this, data);
        if(data.agendaRequestItems && data.agendaRequestItems.length > 0){
            this.agendaRequestItems = data.agendaRequestItems.map(c=>new AgendaRequestItemModel(c));
        }
    }
}



export class AgendaRequestItemListModel {

    id: number;
    documentNo: string;
    userId: number;
    meetingId: number;
    meetingRoomName: string;
    meetingTypeName: string;
    meetingSubTypeName: string;
    agendaApproverFlowName: string;
    agendaObjectiveName: string;
    agendaConfidentialName: string;
    requesterName: string;
    meetingTitle: string;
    startDate: Date;
    endDate: Date;
    agendaObjectiveId: number;
    agendaConfidentialId: number;
    title: string;
    description: string;
    useTime: number;
    isVote: boolean;
    isVoteOpen: boolean;
    isConfirm: boolean;
    submittedDate: Date;
    createdDate: Date;
    createdIp: string;
    createdUser: string;
    updatedDate: Date;
    updatedIp: string;
    updatedUser: string;
    isApproved: boolean;
    approveStatus: string;

    constructor(data) {
        Object.assign(this, data);
    }

}

export class AgendaRequestItemApproveModel {
    stepName: string;
    approverName: string;
    actionDate: Date;
    action: string;
    remark: string;

    constructor(data) {
        Object.assign(this, data);
    }
}

export class AgendaRequestTeamFormModel {
    id: number;
    userId: number;
    constructor(data) {
        Object.assign(this, data);
    }
}


export class AgendaRequestAttachmentModel {
    id: number;
    isCheck: boolean = false;
    attachmentType: string;
    documentTypeId: number;
    documentTypeName: string;
    agendaRequestItemId: number;
    attachmentId: number;
    fileName: string;
    realFileName: string;
    fileType: string;
    fileSize: number;
    fileUrl: string;
    title: string;
    pos: number;
    permissions: AgendaRequestAttachmentPermissionModel[] = [];
    isNew: boolean = false;
    isApprover: boolean = false;
    updatedDate: Date;
    updatedUser: string;
    constructor(data) {
        Object.assign(this, data);
    }
}

export class AgendaRequestAttachmentFormModel {
    id: number;
    uid: string;
    attachmentType: string;
    documentTypeId: number;
    agendaRequestItemId: number;
    attachmentId: number;
    pos: number;
    constructor(data) {
        Object.assign(this, data);
    }
}

export class AgendaRequestAttachmentPermissionModel {
    id: number;
    attachmentId: number;
    userId: number;
    name: string;
    isRead: boolean;
    isDownload: boolean;
    constructor(data) {
        Object.assign(this, data);
    }
}

export class AgendaRequestAttachmentPermissionFormModel {
    id: number;
    agendaRequestItemId: number;
    attachmentId: number;
    userId: number;
    isRead: boolean;
    isDownload: boolean;
    constructor(data) {
        Object.assign(this, data);
    }
}

export class AgendaRequestPermissionFormModel {
    attachments: AgendaRequestAttachmentModel[] = [];
    permissions: AgendaRequestAttachmentPermissionModel[] = [];
}
