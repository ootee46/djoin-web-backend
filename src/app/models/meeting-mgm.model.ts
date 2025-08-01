export class MeetingMgmModel {
    id: number;
    name: string;
    type: string;
    typeText: string;
    meetingDate: Date;
    timeFrom: string;
    timeTo: string;
    active: boolean;
    createdDate: Date;
    createdUser: string;
    updatedDate: Date;
    updatedUser: string;
    constructor(data){
        Object.assign(this,data);
    }
}
