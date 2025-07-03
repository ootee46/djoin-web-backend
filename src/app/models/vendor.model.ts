export class VendorModel{
    id: number;
    code: string;
    name: string;
    address: string;
    phone: string;
    paymentTerm: string;
    contactName: string;
    step1StatusText: string;
    step2StatusText: string;
    currentStatus: string;
    constructor(data: any){
        Object.assign(this,data);
    }
}
