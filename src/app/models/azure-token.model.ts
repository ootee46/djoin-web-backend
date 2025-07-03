export class AzureTokenModel {
    token: string;
    siteId: number;
    constructor(data) {
        Object.assign(this, data);
    }
}
