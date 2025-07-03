import { UserGroupModel } from './user-group.model';

export class MeetingAttendeeModel {
    id: number;
    meetingId: number;
    userId: number;
    userGroup: string[] = [];
    userGroups: UserGroupModel[] = [];
    titleName: string;
    firstName: string;
    lastName: string;
    userName: string;
    name: string;
    email: string;
    department: string;
    jobTitle: string;
    isChairman: boolean;
    isSecretary: boolean;
    isConfirm: boolean = null;
    isSelected: boolean = false;
    confirmDate: Date = null;
    createdDate: Date;
    createdIp: string;
    createdUser: string;
    updatedDate: Date;
    updatedIp: string;
    updatedUser: string;
    constructor(data) {
        Object.assign(this, data);
        if(data.userGroup && Array.isArray(data.userGroup)){
            this.userGroup = data.userGroup;
            this.name = (this.firstName || '') + ' ' + (this.lastName || '');
        }
        if(data.userGroups && Array.isArray(data.userGroups)){
           this.userGroups = data.userGroups.map(c=> new UserGroupModel(c));
        }
    }
}


export class MeetingAttendeeFormModel {
    id: number;
    meetingId: number;
    typeId: number;
    constructor(data) {
        Object.assign(this, data);
    }
}
