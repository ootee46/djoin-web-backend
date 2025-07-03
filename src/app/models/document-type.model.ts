export class DocumentTypeModel {
    id: number;
    name: string;
    createdDate: string;
    createdUser: string;
    createdIp: string;
    updatedDate: string;
    updatedUser: string;
    updatedIp: string;
    isDeleted: boolean;
    active: boolean;
    constructor(data: any) {
        Object.assign(this, data);
        this.id = (data.id ? data.id : 0);
        this.active = (typeof (data.active) == 'boolean' ? this.active : true);
    }
}

export class DocumentTypeListModel {
    id: number;
    name: string;
    createdDate: string;
    createdUser: string;
    createdIp: string;
    updatedDate: string;
    updatedUser: string;
    updatedIp: string;
    active: boolean;
    constructor(data: any) {
        Object.assign(this, data);
        this.id = (data.id ? data.id : 0);
        this.active = (typeof (data.active) == 'boolean' ? this.active : true);
    }
}

export class DocumentTypeFormModel {
    id: number;
    name: string;
    active: boolean;
    constructor(data: any) {
        Object.assign(this, data);
        this.id = (data.id ? data.id : 0);
        this.active = (typeof (data.active) == 'boolean' ? this.active : true);
    }
}
