import { UserModel } from './user.model';

export class InvitationFormModel{
    id: number;
    method: string;
    meetingId: number;
    users: number[];
    constructor(data){
        Object.assign(this,data);
    }
}

export class InvitationModel{
   id: number;
   method: string;
   meetingId: number;
   users: UserModel[];
   result: boolean;
   errorMessage: string;
   createdDate: Date;
    constructor(data){
        Object.assign(this,data);
    }
}
