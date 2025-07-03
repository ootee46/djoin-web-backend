export class AgendaApproveModel {
    id: number;
    name: string;
    active: boolean;
    createdDate: Date;
    createdUser: string;
    updatedDate: Date;
    updatedUser: string;
    constructor(data){
        Object.assign(this,data);
    }
}
