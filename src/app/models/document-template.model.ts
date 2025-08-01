import { AttachmentModel } from './attachment.model';

export class DocumentTemplateModel {
    id: number;
    name: string;
    detail: string;
    attachmentId: number;
    active: boolean;
    createdDate: Date;
    createdIp: string;
    createdUser: string;
    updatedDate: Date;
    updatedIp: string;
    updatedUser: string;
    attachment: AttachmentModel;
    constructor(data: any) {
        Object.assign(this, data);
        if (data.attachment) {
            this.attachment = new AttachmentModel(data.attachment);
        } else {
            this.attachment = null;
        }
        this.id = (data.id ? data.id : 0);
        this.active = (typeof (data.active) == 'boolean' ? this.active : true);
    }
}

export class DocumentTemplateListModel {
    id: number;
    name: string;
    detail: string;
    attachmentId: number;
    active: boolean;
    createdDate: Date;
    createdIp: string;
    createdUser: string;
    updatedDate: Date;
    updatedIp: string;
    updatedUser: string;
    attachment: AttachmentModel;
    constructor(data: any) {
        Object.assign(this, data);
        if (data.attachment) {
            this.attachment = new AttachmentModel(data.attachment);
        } else {
            this.attachment = null;
        }
    }
}

export class DocumentTemplateFormModel {
    id: number;
    name: string;
    detail: string;
    attachmentId: number;
    active: boolean;
    constructor(data: any) {
        Object.assign(this, data);
        this.id = (data.id ? data.id : 0);
        this.active = (typeof (data.active) == 'boolean' ? this.active : true);
    }
}
