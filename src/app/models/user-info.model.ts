export class UserInfoModel {
  id: number;
  name: string;
  email: string;
  constructor(data) {
      Object.assign(this, data);
  }
}
