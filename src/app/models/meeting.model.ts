import { MeetingRoomModel } from './meeting-room.model';
import { AgendaApproverFlowModel, MeetingSubTypeModel, MeetingTypeModel } from './standard.model';
import { UserModel } from './user.model';

export class MeetingFormModel {
    id: number = 0;
    meetingRoomId: number;
    meetingNo: string;
    startDate: Date;
    endDate: Date;
    title: string;
    detail: string;
    venue: string;
    conferenceUrl: string;
    isAutoEndDate: boolean;
    isConfirmed: boolean;
    active: boolean;
    meetingTypeId: number;
    meetingSubTypeId: number;
    agendaApproverFlowId: number;
    isReserved: boolean;
    reserveRejectType: number;
    reserveStartDate: Date;
    reserveEndDate: Date;
    constructor(data){
        Object.assign(this,data);
        this.active = (typeof(data.active) == 'boolean' ? data.active : true);
    }
}
export class MeetingListModel extends MeetingFormModel {
    uid: string;
    minuteFileName: string;
    minuteRealFileName: string;
    minuteFileType: string;
    minuteFileSize: number;
    minuteUrl: string;
    createdDate: Date;
    createdIp: string;
    createdUser: string;
    updatedDate: Date;
    updatedIp: string;
    updatedUser: string;
    meetingRoomName: string;
    meetingTypeName: string;
    meetingSubTypeName: string;
    agendaApproverFlowName: string;
    attendees: UserModel[] = [];
    constructor(data) {
        super(data);
        Object.assign(this, data);
        if(data.attendees && data.attendees.length > 0){
            this.attendees = data.attendees.map(c=>new UserModel(c));
        }
    }
}
export class MeetingModel extends MeetingListModel {
    color: string;
    meetingRoom: MeetingRoomModel;
    meetingType: MeetingTypeModel;
    meetingSubType: MeetingSubTypeModel;
    agendaApproverFlow: AgendaApproverFlowModel;
    constructor(data){
        super(data);
        Object.assign(this,data);
    }

}
