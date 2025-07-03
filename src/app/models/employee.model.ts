export class EmployeeModel{
    id: number;
    code: string;
    fullName: string;
    titleName: string;
    firstName: string;
    lastName: string;
    firstNameTh: string;
    lastNameTh: string;
    firstNameEn: string;
    lastNameEn: string;
    position: string;
    department: string;
    active: boolean;
    updatedDate: string;
    constructor(data: any){
        Object.assign(this,data);
    }
}
