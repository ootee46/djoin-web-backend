import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'app/core/auth/auth.service';
import { AttachmentModel } from 'app/models/attachment.model';
import { GlobalService } from 'app/services/global.service';
import { Subject, tap } from 'rxjs';

@Component({
    selector: 'image-viewer',
    templateUrl: './image-viewer.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ImageViewerComponent implements OnInit, OnDestroy {
    @ViewChild('myImage', { static: false }) myImage: ElementRef;
    url: string;
    overideUrl: string;
    fileData: string;
    private _unsubscribeAll: Subject<any> = new Subject();
    constructor(
        private _matDialogRef: MatDialogRef<ImageViewerComponent>
        , private _authService: AuthService
        , private _httpClient: HttpClient
        , private _globalService: GlobalService
        , @Inject(MAT_DIALOG_DATA) private input: AttachmentModel,
    ) { }

    ngOnInit(): void {


        this.url = this.input.fileUrl + '&access_token=' + this._authService.accessToken;

        const httpOptions = new HttpHeaders({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Authorization': 'Bearer ' + this._globalService.accessToken
        });
        this._httpClient.get(this.url, { responseType: 'blob', observe: 'response', headers: httpOptions }).pipe(
            tap((response: any) => {
                if (response && response.body) {
                    this.fileData = URL.createObjectURL(response.body);
                    this.myImage.nativeElement.src = this.fileData;
                }


            })
        ).subscribe();

    }

    close(): void {
        this._matDialogRef.close();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
