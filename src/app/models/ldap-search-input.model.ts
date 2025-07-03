export class LdapSearchInputModel {
    searchType: string;
    kw: string;
    ldapId: number;

    constructor(data) {
        Object.assign(this, data);
    }
}
