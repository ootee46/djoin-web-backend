export class FileOpenModel{
    id: number;
    type: string;
    fileName: string;
    name: string;
    title: string;
    createdDate: Date;
    createdUser: string;
    updatedDate: Date;
    updatedUser: string;
    active: boolean;
    constructor(data){
        Object.assign(this,data);
    }
}
