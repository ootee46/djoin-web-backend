export class DownloadLogModel{
    id: number;
    name: number;
    type: string;
    title: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    fileUrl: string;
    createdDate: Date;
    constructor(data){
        Object.assign(this,data);
    }
}
