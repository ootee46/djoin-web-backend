export class AgendaModel{
    id: number;
    no: string;
    title: string;
    useTime: number;
    isAttachment: boolean;
    isVote: boolean;
    isVoteOpen: boolean;
    step: number;
    minuteStatus: string;
    isBooking: boolean;
    bookingName: string;
    bookingDate: boolean;
    documentStatus: string;
    createdDate: Date;
    createdUser: string;
    updatedDate: Date;
    updatedUser: string;
    subAgendas: AgendaModel[];
    constructor(data){
        Object.assign(this,data);
        if(data.subAgendas && Array.isArray(data.subAgendas) && data.subAgendas.length > 0){
            this.subAgendas = data.subAgendas.map(c=>new AgendaModel(c));
        }
    }
}
