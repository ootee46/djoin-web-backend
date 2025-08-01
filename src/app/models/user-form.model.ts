export class UserFormModel {
    id: number;
    titleName: string;
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
    pin: string;
    isLdap: boolean;
    description: string;
    jobTitle: string;
    department: string;
    company: string;
    officePhone: string;
    mobilePhone: string;
    homePhone: string;
    website: string;
    fax: string;
    email: string;
    userLevel: number;
    ldapId: number;
    allMeetingRoom: boolean;
    passwordExpire: Date;
    accountExpire: Date;
    forcePasswordPolicy: number;
    active: boolean;
    meetingRooms: number[] = [];
    approvers: ApproverUserFormModel[] = [];
    constructor(data) {
        Object.assign(this, data);
        this.id = (data.id ? data.id : 0);
        this.active = (typeof (data.active) == 'boolean' ? data.active : true);
        this.isLdap = (typeof (data.isLdap) == 'boolean' ? data.isLdap : true);
    }
}

export class ApproverUserFormModel{
    approverId: number;
    approverPositionId: number;
    constructor(data){
        Object.assign(this,data);
    }
}
