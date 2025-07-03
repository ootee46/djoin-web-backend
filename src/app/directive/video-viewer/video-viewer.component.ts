import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { AttachmentModel } from 'app/models/attachment.model';
import { Observable, Subject } from 'rxjs';

@Component({
    selector: 'video-viewer',
    templateUrl: './video-viewer.component.html',
    encapsulation: ViewEncapsulation.None
})
export class VideoViewerComponent implements OnInit, OnDestroy {
    url: string;
    overideUrl: string;
    private _unsubscribeAll: Subject<any> = new Subject();
    constructor(
         private _matDialogRef: MatDialogRef<VideoViewerComponent>
        , private _authService: AuthService
        , @Inject(MAT_DIALOG_DATA) private input: AttachmentModel,
    ) { }

    ngOnInit(): void {
        this.url = this.input.fileUrl + '&access_token=' + this._authService.accessToken;
    }

    close(): void{
        this._matDialogRef.close();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
