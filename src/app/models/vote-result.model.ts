export class VoteResultModel{
    name: string;
    agendaId: number;
    createdDate: Date;
    remark: string;
    vote: number;
    userName: string;
    constructor(data){
        Object.assign(this,data);
    }
}
