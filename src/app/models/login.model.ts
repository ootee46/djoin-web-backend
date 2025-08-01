export class LoginModel {
    username: string;
    password: string;
    siteId: number;

    constructor(data) {
        Object.assign(this, data);
    }
}
