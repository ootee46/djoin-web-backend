export class LdapDataModel {
    displayName: string;
    emailAddress: string;
    employeeId: string;
    givenName: string;
    surname: string;
    name: string;
    samAccountName: string;
    userPrincipalName: string;
    voiceTelephoneNumber: string;
    ldapId: number;
    prefixDomain: string;
    constructor(data) {
        Object.assign(this, data);
    }
}
