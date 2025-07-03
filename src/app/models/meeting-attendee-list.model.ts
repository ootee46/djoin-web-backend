export class MeetingAttendeeListModel {
    id: number;
    meetingId: number;
    userId: number;
    isChairman: boolean;
    isSecretary: boolean;
    createdDate: Date;
    createdIp: string;
    createdUser: string;
    updatedDate: Date;
    updatedIp: string;
    updatedUser: string;
    user: MeetingAttendeeUserModel[];

    constructor(data) {
        Object.assign(this, data);
        this.user = (data.user && Array.isArray(data.user) ? data.user.map((c: any) => new MeetingAttendeeUserModel(c)) : []);
    }
}

export class MeetingAttendeeUserModel {
    titleName: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    groups: MeetingAttendeeGroupModel[];
    constructor(data) {
        Object.assign(this, data);
        this.groups = (data.groups && Array.isArray(data.groups) ? data.groups.map((c: any) => new MeetingAttendeeGroupModel(c)) : []);
    }
}

export class MeetingAttendeeGroupModel {
    name: string;
    constructor(data) {
        Object.assign(this, data);
    }
}
