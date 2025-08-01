export class ErrorLogModel{
  id: number;
  url: string;
  message: string;
  stackTrace: string;
  createdDate: string;
  createdIp: string;

  constructor(data){
    Object.assign(this,data);
  }
}
