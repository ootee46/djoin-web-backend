export class LoginLogModel {
  id: number;
  username: string;
  createdDate: Date;
  constructor(data) {
    Object.assign(this, data);
  }
}
export class FailLoginLogModel extends LoginLogModel{}
