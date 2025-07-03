export class MemberModel{
    id: number;
    code: string;
    fullName: string;
    titleName: string;
    firstName: string;
    lastName: string;
    position: string;
    department: string;
    active: boolean;
    updatedDate: string;
    constructor(data: any){
        Object.assign(this,data);
    }
}
