export class AgendaRequestImportModel{
    meetingId: number;
    id: number;
    parentId: number;

    constructor(data){
        Object.assign(this,data);
    }
}
