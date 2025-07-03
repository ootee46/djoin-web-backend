import { ApproverStepItemModel } from './approver-step-item.model';
import { UserModel } from './user.model';

export class StandardModel {
    id: number;
    name: string;
    title: string;
    createdDate: Date;
    createdUser: string;
    createdIp: string;
    updatedDate: Date;
    updatedUser: string;
    updatedIp: string;
    isDefault: boolean;
    active: boolean;
    constructor(data: any) {
        this.id = typeof (data.id) == 'number' ? data.id : 0;
        this.name = data.name || null;
        this.title = data.title || null;
        this.createdDate = data.createdDate || null;
        this.createdUser = data.createdUser || null;
        this.createdIp = data.createdIp || null;
        this.updatedDate = data.updatedDate || null;
        this.updatedUser = data.updatedUser || null;
        this.updatedIp = data.updatedIp || null;
        this.isDefault = typeof (data.isDefault) == 'boolean' ? data.isDefault : false;
        this.active = typeof (data.active) == 'boolean' ? data.active : true;
    }
}

export class StandardFormModel {
    id: number;
    name: string;
    title: string;
    isDefault: boolean;
    active: boolean;
    constructor(data: any) {
        this.id = typeof (data.id) == 'number' ? data.id : 0;
        this.name = data.name || null;
        this.title = data.title || null;
        this.isDefault = typeof (data.isDefault) == 'boolean' ? data.isDefault : false;
        this.active = typeof (data.active) == 'boolean' ? data.active : true;
    }
}
export class AgendaApproverFlowModel extends StandardModel { }
export class AgendaConfidentialModel extends StandardModel { }
export class AgendaObjectiveModel extends StandardModel { }
export class ApproverPositionModel extends StandardModel { }
export class MeetingTypeModel extends StandardModel {
    meetingSubTypes: MeetingSubTypeModel[] = [];
    constructor(data) {
        super(data);
        if (data.meetingSubTypes && Array.isArray(data.meetingSubTypes) && data.meetingSubTypes.length > 0) {
            data.meetingSubTypes.map((c: any) => new MeetingSubTypeModel(c));
        }
    }
}
export class MeetingSubTypeModel extends StandardModel {
    meetingTypeId: number;
    meetingType: string;
    constructor(data) {
        super(data);
        this.meetingTypeId = typeof (data.meetingTypeId) == 'number' ? data.meetingTypeId : null;
        this.meetingType = data.meetingType || null;
    }
}

export class ApproverGroupModel extends StandardModel {
    users: UserModel[] = [];
    constructor(data) {
        super(data);
        if (typeof (data.users) == 'object' && Array.isArray(data.users) && data.users.length > 0) {
            this.users = data.users.map((c: any) => new UserModel(c));
        }
    }
}

export class ApproverGroupFormModel extends StandardModel {
    users: number[] = [];
    constructor(data) {
        super(data);
        if (typeof (data.users) == 'number' && data.users.length > 0) {
            this.users = data.users;
        }
    }
}

export class ApproverStepModel extends StandardModel {
    items: ApproverStepItemModel[] = [];
    constructor(data) {
        super(data);
        if (typeof (data.items) == 'object' && Array.isArray(data.items) && data.items.length > 0) {
            this.items = data.items.map((c: any) => new ApproverStepItemModel(c));
        }
    }
}

export class ApproverStepFormModel extends StandardModel {
    items: ApproverStepItemModel[] = [];
    constructor(data) {
        super(data);
        if (typeof (data.items) == 'object' && Array.isArray(data.items) && data.items.length > 0) {
            this.items = data.items.map((c: any) => new ApproverStepItemModel(c));
        }
    }
}



