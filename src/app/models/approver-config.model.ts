export class ApproverConfigModel{
    id: number;
    meetingTypeId: number;
    meetingSubTypeId: number;
    agendaObjectiveId: number;
    agendaConfidentialId: number;
    agendaApproverFlowId: number;
    preMeetingApproverId: number;
    postMeetingApproverId: number;
    cancelApproverId: number;
    editApproverId: number;
    reserveRejectType: number;
    meetingType: string;
    meetingSubType: string;
    agendaObjective: string;
    agendaConfidential: string;
    agendaApproverFlow: string;
    preMeetingApprover: string;
    postMeetingApprover: string;
    cancelApprover: string;
    editApprover: string;
    createdDate: Date;
    createdIp: string;
    createdUser: string;
    updatedDate: Date;
    updatedIp: string;
    updatedUser: string;
    constructor(data) {
        Object.assign(this, data);
    }
}

export class ApproverConfigListModel{
    id: number;
    meetingTypeId: number;
    meetingSubTypeId: number;
    agendaObjectiveId: number;
    agendaConfidentialId: number;
    agendaApproverFlowId: number;
    preMeetingApproverId: number;
    postMeetingApproverId: number;
    cancelApproverId: number;
    editApproverId: number;
    reserveRejectType: number;
    meetingType: string;
    meetingSubType: string;
    agendaObjective: string;
    agendaConfidential: string;
    agendaApproverFlow: string;
    preMeetingApprover: string;
    postMeetingApprover: string;
    cancelApprover: string;
    editApprover: string;
    createdDate: Date;
    createdIp: string;
    createdUser: string;
    updatedDate: Date;
    updatedIp: string;
    updatedUser: string;
    constructor(data) {
        Object.assign(this, data);
    }
}

export class ApproverConfigFormModel{
    id: number;
    meetingTypeId: number;
    meetingSubTypeId: number;
    agendaObjectiveId: number;
    agendaConfidentialId: number;
    agendaApproverFlowId: number;
    preMeetingApproverId: number;
    postMeetingApproverId: number;
    cancelApproverId: number;
    editApproverId: number;
    reserveRejectType: number;
    constructor(data) {
        Object.assign(this, data);
    }
}
