export class MeetingRelationModel {
    requestNo: string;
    meetingName: string;
    meetingNo: string;
    startDate: Date;
    endDate: Date;
    objective: string;
    confidential: string;
    constructor(data) {
        Object.assign(this, data);
    }
}