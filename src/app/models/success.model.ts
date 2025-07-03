export class SuccessModel{
    id: string;
    result: boolean;
    code: string;
    constructor(data: any){
        this.id = data.id || null;
        this.result = data.result || false;
        this.code = data.code || null;
    }
}
