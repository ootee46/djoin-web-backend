export class TempFileUploadModel {
    id: number;
    fileName: string;
    fileType: string;
    fileSize: number;
    fileUrl: string;
    realFileName: string;
    salt: string;
    createdDate: string;
    createdIP: string;
    createdUser: string;
    constructor(data) {
        Object.assign(this, data);
    }
}
