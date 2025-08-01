import { MemberUserModel } from './member-user.model';

export class MemberGroupModel{
    id: number;
    name: string;
    totalUser: number;
    createdDate: Date;
    createdUser: string;
    updatedDate: Date;
    updatedUser: string;
    active: boolean;
    members: MemberUserModel[];
    constructor(data){
        Object.assign(this,data);
    }
}
