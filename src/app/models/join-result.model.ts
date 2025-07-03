export class JoinResultModel{
    id: number;
    name: string;
    email: string;
    isConfirm: boolean;
    confirmDate: Date;
    createdDate: Date;
    createdUser: string;
    updatedDate: Date;
    updatedUser: string;
    active: boolean;
    constructor(data){
        Object.assign(this,data);
    }
}
