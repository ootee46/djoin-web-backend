export class CustomerModel{
    id: number;
    customerName: string;
    isAzure: boolean;
    constructor(data){
        Object.assign(this,data);
    }
}
