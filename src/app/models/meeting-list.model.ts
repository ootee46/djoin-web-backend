export class MeetingListModel {
    id: number;
    meetingRoomId: number;
    meetingNo: string;
    startDate: Date;
    endDate: Date;
    title: string;
    detail: string;
    venue: string;
    conferenceUrl: string;
    isMinuteConfirm: boolean;
    minuteConfirmDate: Date;
    isAutoEndDate: boolean;
    isConfirmed: boolean;
    active: boolean;
    meetingTypeId: number;
    isReserved: boolean;
    meetingRoomText: string;
    meetingTypeText: string;
    constructor(data) {
        Object.assign(this, data);
    }
}
