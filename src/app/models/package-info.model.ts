export class PackageInfoModel{
  packageName: string;
  diskUse: string;
  diskLimit: string;
  userUse: number;
  userLimit: string;
  thisYearMeeting: number;
  upcomeMeeting: number;
  totalMeeting: number;
  totalWaitingAgenda: number;
  totalWaitingMinute: number;
  totalAgendaRequest: number;
  constructor(data){
    Object.assign(this,data);
    if(data.diskLimit === 0){
      this.diskLimit = 'Unlimit';
    }else{
      this.diskLimit = this.calSize(data.diskLimit);
    }
    this.diskUse = this.calSize(data.diskUse);
    if(data.userLimit === 0){
      this.userLimit = 'Unlimit';
    }
  }

  calSize(fileSize: number): string
  {
    if(typeof fileSize != "number" || Number.isNaN(fileSize)){
      return '';
    }
    else if(fileSize === 0){
      return '0 Bytes';
    }
    else{
      const k = 1024;
      const dm = 0;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(fileSize) / Math.log(k));
      return parseFloat((fileSize / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
  }
}
