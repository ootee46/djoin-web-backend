
import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';
import { AttachmentConfig } from './attachment-config.type';
import { AttachmentModel } from 'app/models/attachment.model';
import { FileDescModel } from 'app/models/file-desc.model';
@Injectable({
    providedIn: 'root'
})
export class AttachmentService {


    constructor(@Inject('config') private _config: AttachmentConfig, private _httpClient: HttpClient,) {
    }
    uploadFile(file: File): Observable<HttpEvent<AttachmentModel>>{
        const fd = new FormData();
        fd.append('file', file, file.name);
        const headers = new HttpHeaders();
        headers.set('Cache-Control', 'no-cache');
        headers.set('Authorization', 'Bearer ' + this._config.token);

        return this._httpClient.post<AttachmentModel>(this._config.uploadUrl,fd,{
            headers,
            reportProgress: true,
            observe: 'events',
            withCredentials: false,
        });
    }

    updateDesc(value: FileDescModel): Observable<HttpEvent<any>> {
        const headers = new HttpHeaders();
        headers.set('Cache-Control', 'no-cache');
        headers.set('Authorization', 'Bearer ' + this._config.token);
        return this._httpClient.post<any>(this._config.fileDescUrl, value, {
            headers,
            withCredentials: false,
        });
    }


}
