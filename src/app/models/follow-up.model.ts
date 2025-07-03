import { AttachmentFormModel } from './attachment.model';

export class FollowUpModel {
    id: number;
    meetingId: number;
    title: string;
    detail: string;
    remark: string;
    startDate: Date;
    endDate: Date;
    sender: string;
    cc: string;
    isVisabled: boolean;
    status: string;
    createdDate: Date;
    createdIp: string;
    createdUser: string;
    updatedDate: Date;
    updatedIp: string;
    updatedUser: string;
    followUpAttachments: FollowUpAttachmentModel[];
    followUpAttendees: FollowUpAttendeeModel[];
    constructor(data) {
        Object.assign(this, data);
        // eslint-disable-next-line max-len
        this.followUpAttachments = (data.followUpAttachments && Array.isArray(data.followUpAttachments) ? data.followUpAttachments.map((c: any) => new FollowUpAttachmentModel(c)) : []);
        this.followUpAttendees = (data.followUpAttendees && Array.isArray(data.followUpAttendees) ? data.followUpAttendees.map((c: any) => new FollowUpAttendeeModel(c)) : []);
    }
}

export class FollowUpAttendeeModel {
    id: number;
    userId: number;
    titleName: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    constructor(data) {
        Object.assign(this, data);
        this.fullName = (data.firstName ? data.firstName + ' ': '') + (data.lastName ? data.lastName : '');
    }
}

export class FollowUpAttachmentModel {
    id: number;
    title: string;
    uid: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    fileUrl: string;
    isNew: boolean = false;
    realFileName: string;
    salt: string;
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

export class FollowUpFormModel {
    id: number;
    meetingId: number;
    title: string;
    detail: string;
    remark: string;
    startDate: Date;
    endDate: Date;
    sender: string;
    cc: string;
    isVisabled: boolean = true;
    status: string;
    attendees: number[];
    attachments: AttachmentFormModel[];
    constructor(data) {
        Object.assign(this, data);
    }

}

export class FollowUpListModel {
    id: number;
    meetingId: number;
    title: string;
    startDate: Date;
    endDate: Date;
    isVisabled: boolean;
    status: string;
    createdDate: Date;
    createdIp: string;
    createdUser: string;
    updatedDate: Date;
    updatedIp: string;
    updatedUser: string;
    followUpAttendees: FollowUpAttendeeModel[];
    attachment: FollowUpAttachmentModel;
    constructor(data) {
        Object.assign(this, data);
        this.followUpAttendees = (data.followUpAttendees && Array.isArray(data.followUpAttendees) ? data.followUpAttendees.map((c: any) => new FollowUpAttendeeModel(c)) : []);
        this.attachment = (data.attachment ? new FollowUpAttachmentModel(data.attachment): null );
    }
}
