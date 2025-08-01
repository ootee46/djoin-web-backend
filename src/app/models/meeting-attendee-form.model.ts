export class MeetingAttendeeFormModel {
    typeId: number;
    meetingId: number;
    id: number;
    constructor(data) {
        Object.assign(this, data);
    }
}
