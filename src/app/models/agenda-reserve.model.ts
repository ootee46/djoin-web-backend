export class AgendaReserveModel {
    id: number;
    name: string;
    agenda: string;
    active: boolean;
    items: AgendaReserveItemModel[];
    createdDate: Date;
    createdUser: string;
    updatedDate: Date;
    updatedUser: string;
    constructor(data){
        Object.assign(this,data);
        if(!this.items){
            this.items = [];
        }
    }
}

export class AgendaReserveItemModel{
    id: number;
    agendaId: number;
    meetingId: number;
    meetingName: string;
    meetingType: string;
    meetingTypeText: string;
    meetingDate: Date;
    meetingTimeFrom: string;
    meetingTimeTo: string;
    agenda: string;
    active: boolean;
    statusText: string;
    status: string;
    createdDate: Date;
    createdUser: string;
    updatedDate: Date;
    updatedUser: string;
    constructor(data){
        Object.assign(this,data);
    }
}
