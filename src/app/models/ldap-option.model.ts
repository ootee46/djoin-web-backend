export class LdapOptionModel{
    id: number;
    domain: string;
    prefixDomain: string;
    constructor(data){
        Object.assign(this,data);
    }
}
