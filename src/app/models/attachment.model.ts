export class AttachmentModel{
    id: number;
    uid: string;
    fileName: string;
    realFileName: string;
    fileType: string;
    fileSize: number;
    fileUrl: string;
    title: string;
    salt: string;
    isNew: boolean;
    isExternal: boolean;
    createdDate: Date;
    createdUser: string;
    createdIp: string;
    updatedDate: Date;
    updatedUser: string;
    updatedIp: string;
    constructor(data){
     Object.assign(this,data);
    }
}

export class MeetingAttachmentModel {
    id: number;
    agendaId: number;
    meetingId: number;
    documentTypeId: number;
    documentTypeName: string;
    fileName: string;
    realFileName: string;
    fileType: string;
    fileSize: number;
    fileUrl: string;
    title: string;
    salt: string;
    pos: number;
    isNew: boolean;
    flag: number;
    isCheck: boolean;
    isExternal: boolean;
    createdDate: Date;
    createdUser: string;
    createdIp: string;
    updatedDate: Date;
    updatedUser: string;
    updatedIp: string;
    permissions: AttachmentPermissionModel[] = [];
    constructor(data){
        Object.assign(this,data);
        this.isCheck = false;
        if(data.permissions && Array.isArray(data.permissions) && data.permissions.length > 0)
        {
            this.permissions = data.permissions.map(c=>new AttachmentPermissionModel(c));
        }
    }
}

export class AttachmentPermissionModel {
    id: number;
    meetingAttachmentId: number;
    userId: number;
    isRead: boolean;
    isDownload: boolean;
    createdDate: Date;
    createdIp: string;
    createdUser: string;
    updatedDate: Date;
    updatedIp: string;
    updatedUser: string;
    name: string;
    constructor(data){
        Object.assign(this,data);
    }
}

export class AttachmentPermissionFormModel {
    id: number;
    meetingAttachmentId: number;
    userId: number;
    isRead: boolean;
    isDownload: boolean;
    name: string;
    constructor(data){
        this.id = data.id || 0;
        this.meetingAttachmentId = data.meetingAttachmentId || null;
        this.userId = data.userId || null;
        this.isRead = data.isRead || false;
        this.isDownload = data.isDownload || false;
        this.name = data.name || null;
    }
}

export class AttachmentFormModel {
    id: number;
    uid: string;
    isTemp: boolean;
    isNew: boolean;
    documentTypeId: number;
    pos: number;
    permissions: AttachmentPermissionFormModel[] = [];
    constructor(data) {
        this.id = data.id || 0;
        this.isTemp = data.isTemp || false;
        this.uid = data.uid || null;
        this.isNew = data.isNew || false;
        this.documentTypeId = data.documentTypeId || null;
        this.pos = data.pos || null;
        if(data.permissions && data.permissions.length > 0){
            this.permissions = data.permissions.map(c=> new AttachmentPermissionFormModel(c));
        }
    }
}

