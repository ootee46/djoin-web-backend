/* eslint-disable @typescript-eslint/naming-convention */
export class FileUploadModel {
    FileName: string;
    FileSize: number;
    FileType: string;
    StoreFileName: string;
    FileUrl: string;
    Salt: string;
    constructor(data) {
        this.FileName = data.FileName || null;
        this.FileSize = data.FileSize || null;
        this.FileType = data.FileType || null;
        this.StoreFileName = data.StoreFileName || null;
        this.FileUrl = data.FileUrl || null;
        this.Salt = data.Salt || null;
    }
}
