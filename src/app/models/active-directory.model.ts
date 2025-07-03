export class ActiveDirectoryModel {
    ldapId: number;
    prefixDomain: string;
    displayName: string;
    emailAddress: string;
    employeeId: string;
    givenName: string;
    surname: string;
    name: string;
    samAccountName: string;
    userPrincipalName: string;
    voiceTelephoneNumber: string;
    constructor(data) {
        Object.assign(this,data);
    }
}
