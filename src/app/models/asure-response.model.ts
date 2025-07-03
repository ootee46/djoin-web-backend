export class AzureResponseDto {
    id: string;
    displayName: string;
    givenName: string;
    jobTitle: string;
    mail: string;
    mobilePhone: string;
    officeLocation: string;
    preferredLanguage: string;
    surname: string;
    userPrincipalName: string;
    constructor(data: any) {
        Object.assign(this, data);
    }
}
