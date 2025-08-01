import { MemberGroupModel } from './member-group.model';

export class MemberUserModel {
    id: number;
    fullName: string;
    domain: string;
    email: string;
    level: string;
    levelId: number;
    isLdap: boolean;
    isAllMemberGroup: boolean;
    createdDate: Date;
    createdUser: string;
    updatedDate: Date;
    updatedUser: string;
    active: boolean;
    memberGroups: MemberGroupModel[];
    constructor(data){
        Object.assign(this,data);
        if(this.isLdap == null || this.isLdap === undefined){this.isLdap = true;}
        if(this.isAllMemberGroup == null || this.isAllMemberGroup === undefined){this.isAllMemberGroup = false;}
    }
}
