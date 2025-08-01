import { MeetingRoomModel } from './meeting-room.model';
import { UserGroupModel } from './user-group.model';

export class UserModel {
    id: number;
    name: string;
    domain: string;
    titleName: string;
    firstName: string;
    lastName: string;
    userName: string;
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
    updatedDate: Date;
    updatedUser: string;
    active: boolean;
    meetingRooms: MeetingRoomModel[];
    userGroups: UserGroupModel[];
    approvers: ApproverUserModel[];
    constructor(data){
        Object.assign(this,data);
        this.id = (data.id ? data.id : 0);
        this.active = (typeof (data.active) == 'boolean' ? data.active : true);
        this.isLdap = (typeof (data.isLdap) == 'boolean' ? data.isLdap : true);
        this.allMeetingRoom = (typeof (data.allMeetingRoom) == 'boolean' ? data.allMeetingRoom : false);
        this.userLevel = (typeof (data.userLevel) == 'number' ? data.userLevel : 3);
        this.meetingRooms = (data.meetingRooms && Array.isArray(data.meetingRooms) ? data.meetingRooms.map(c=>new MeetingRoomModel(c)) : []);
        this.userGroups = (data.userGroups && Array.isArray(data.userGroups) ? data.userGroups.map(c=>new UserGroupModel(c)) : []);
        this.approvers = (data.approvers && Array.isArray(data.approvers) ? data.approvers.map(c=>new ApproverUserModel(c)) : []);
    }
}


export class UserListModel{
     id: number;
     name: string;
     titleName: string;
     firstName: string;
     lastName: string;
     userName: string;
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
     allMeetingRoom: boolean;
     passwordExpire: Date;
     accountExpire: Date;
     forcePasswordPolicy: number;
     active: boolean;
     updatedDate: Date;
     updatedUser: string;
     constructor(data){
        Object.assign(this,data);
    }
}

export class ApproverUserModel{
    id: number;
    approverId: number;
    approverPositionId: number;
    positionTitle: string;
    titleName: string;
    firstName: string;
    lastName: string;
    userName: string;
    jobTitle: string;
    email: string;
    constructor(data){
        Object.assign(this,data);
    }
}
