import { UserInfoModel } from './user-info.model';

export class LoginResponseModel {
    token: string;
    user: UserInfoModel[];
    constructor(data) {
        Object.assign(this, data);
        this.user = (data.user && Array.isArray(data.user) ? data.user.map((c: any) => new UserInfoModel(c)) : []);
    }
}
