import { BehaviorSubject, Observable } from 'rxjs';
import { AgendaRequestAttachmentModel } from './agenda-request.model';
import { UserModel } from './user.model';

export class AgendaRequestFormModel{
     id: number;
     meetingId: number;
     agendaObjectiveId: number;
     agendaConfidentialId: number;
     title: string;
     meetingTitle: string;
     meetingTypeName: string;
     startDate: Date;
     endDate: Date;
     description: string;
     useTime: number;
     isVote: boolean;
     isVoteOpen: boolean;
     isConfirm: boolean;
     presenters: number[] = [];
     excludeUsers: number[] = [];
     presenterId: number = null;
     excludeUserId: number = null;
     optionPresenters: BehaviorSubject<UserModel[] | []> = new BehaviorSubject([]);
     optionExcludeUsers: BehaviorSubject<UserModel[] | []> = new BehaviorSubject([]);
     selectedPresenters: UserModel[] = [];
     selectedExcludeUsers: UserModel[] = [];
     attendees: UserModel[] = [];
     bookingDetail: string;
     constructor(data){
        this.id = 0;
        this.meetingId = (data.id ? data.id : 0);
        this.meetingTitle = (data.title ? data.title : null);
        this.startDate = (data.startDate ? data.startDate : null);
        this.endDate = (data.endDate ? data.endDate : null);
        this.meetingTypeName = (data.meetingTypeName ? data.meetingTypeName : null);
        this.agendaObjectiveId = null;
        this.agendaConfidentialId = null;
        this.title = null;
        this.description = null;
        this.useTime = null;
        this.isVote = false;
        this.isVoteOpen =  false;
        this.isConfirm =  false;
        this.bookingDetail = null;
        if(data.attendees && data.attendees.length > 0){
            this.attendees = data.attendees.map(c=>new UserModel(c));
        }
     }

    get presenters$(): Observable<UserModel[]> {
        return this.optionPresenters.asObservable();
    }
    get excludeUsers$(): Observable<UserModel[]> {
        return this.optionExcludeUsers.asObservable();
    }
}


export class AgendaRequestUpdateFormModel{
    id: number;
    title: string;
    description: string;
    useTime: number;
    isVote: boolean;
    isVoteOpen: boolean;
    isConfirm: boolean;
    presenters: number[] = [];
    excludeUsers: number[] = [];
    presenterAttachments: AgendaRequestAttachmentModel[] = [];
    attachments: AgendaRequestAttachmentModel[] = [];
    bookingDetail: string;
    constructor(data){
       Object.assign(this,data);
    }
}
