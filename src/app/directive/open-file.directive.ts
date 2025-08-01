/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Directive, HostListener, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FuseSplashScreenService } from '@fuse/services/splash-screen/splash-screen.service';
import { AttachmentModel } from 'app/models/attachment.model';
import { GlobalService } from 'app/services/global.service';
import { tap } from 'rxjs/operators';
import { FrameViewerComponent } from './frame-viewer/frame-viewer.component';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { VideoViewerComponent } from './video-viewer/video-viewer.component';

@Directive({
    selector: '[openFile]'
})
export class OpenFileDirective {
    @Input() openFile: any;
    private _videoView: MatDialogRef<VideoViewerComponent>;
    private _frameView: MatDialogRef<FrameViewerComponent>;
    private _imageView: MatDialogRef<ImageViewerComponent>;
    private _openUrl: string;
    constructor(private _httpClient: HttpClient, private _router: Router, private _globalService: GlobalService,
        private fuseSplashScreen: FuseSplashScreenService,
        private _matDialog: MatDialog,
    ) {
    }
    @HostListener('click')
    public async onClick(): Promise<void> {
        if(typeof(this.openFile) == 'string')
        {
            const extension = this.getFileExtension(this.openFile);
            const realFileName = this.getParameterByName('file',this.openFile);
            if(extension != null && realFileName != null){
                const fileAttachment = new AttachmentModel({});
                fileAttachment.realFileName = realFileName;
                fileAttachment.id = 0;
                fileAttachment.fileUrl = this.openFile;
                if(extension === 'mp4'){
                    this._videoView = this._matDialog.open(VideoViewerComponent, {
                        panelClass: 'standard-dialog',
                        width: '80%',
                        height: '95vh',
                        data: fileAttachment
                    });
               }
               else if(extension === 'pdf')
               {
                    this._frameView = this._matDialog.open(FrameViewerComponent, {
                        panelClass: 'standard-dialog',
                        width: '80%',
                        height: '95vh',
                        data: fileAttachment
                    });
               }
               else if(extension === 'jpg' || extension === 'png')
               {
                   this._imageView = this._matDialog.open(ImageViewerComponent, {
                       panelClass: 'standard-dialog',
                       width: '80%',
                       height: '95vh',
                       data: fileAttachment
                   });
               }
               else{
                   this.openDirect(this.openFile);
               }
            }
        }
        else{
            const fileAttachment = new AttachmentModel(this.openFile);
            const fileName = '';
            let extension = '';
            extension = this.getFileExtension(fileAttachment.realFileName);
            if(extension === 'mp4'){
                 this._videoView = this._matDialog.open(VideoViewerComponent, {
                     panelClass: 'standard-dialog',
                     width: '80%',
                     height: '95vh',
                     data: fileAttachment
                 });
            }
            else if(extension === 'pdf')
            {
                this._frameView = this._matDialog.open(FrameViewerComponent, {
                    panelClass: 'standard-dialog',
                    width: '80%',
                    height: '95vh',
                    data: fileAttachment
                });
            }
            else if(extension === 'jpg' || extension === 'png')
            {
                this._imageView = this._matDialog.open(ImageViewerComponent, {
                    panelClass: 'standard-dialog',
                    width: '80%',
                    height: '95vh',
                    data: fileAttachment
                });
            }
            else{
                this.openDirect(this.openFile.fileUrl);
            }
            // this._viewerView = this._matDialog.open(FileViewerComponent, {
            //     panelClass: 'standard-dialog',
            //     width: '80%',
            //     height: '95vh',
            //     data: this._openUrl
            // });
        }


        // this.fuseSplashScreen.show();
        // const httpOptions = new HttpHeaders({
        //     'Content-Type': 'application/json',
        //     'Cache-Control': 'no-cache',
        //     'Authorization': 'Bearer ' + this._globalService.accessToken
        // });
        // this._httpClient.get(this._openUrl, { responseType: 'blob', observe: 'response', headers: httpOptions }).pipe(
        //     tap((response: any) => {
        //         const url = URL.createObjectURL(response.body);

        //         setTimeout(() => {
        //             // const anchor = document.createElement('a');
        //             // anchor.href = url;
        //             // anchor.target = '_blank';
        //             // anchor.download = this.getFilenameFromHeaders(response.headers) || 'file';
        //             // document.body.appendChild(anchor);
        //             // anchor.click();
        //             // this.fuseSplashScreen.hide();
        //             // setTimeout(() => {
        //             //     URL.revokeObjectURL(url);
        //             //     document.body.removeChild(anchor);
        //             //   }, 100);
        //             this.fuseSplashScreen.hide();
        //             // URL.revokeObjectURL(url);
        //         }, 100);
        //     })
        // ).subscribe();
    }

    private openDirect(url: string): void {
        this.fuseSplashScreen.show();
        const httpOptions = new HttpHeaders({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Authorization': 'Bearer ' + this._globalService.accessToken
        });
        this._httpClient.get(url, { responseType: 'blob', observe: 'response', headers: httpOptions }).pipe(
            tap((response: any) => {
                const url2 = URL.createObjectURL(response.body);

                setTimeout(() => {
                    const anchor = document.createElement('a');
                    anchor.href = url2;
                    anchor.download = this.getFilenameFromHeaders(response.headers) || 'file';
                    document.body.appendChild(anchor);
                    anchor.click();
                    this.fuseSplashScreen.hide();
                    setTimeout(() => {
                        URL.revokeObjectURL(url2);
                        document.body.removeChild(anchor);
                      }, 100);
                    this.fuseSplashScreen.hide();
                }, 100);
            })
        ).subscribe();
    }
    private getFilenameFromHeaders(headers: HttpHeaders): string {
        // The content-disposition header should include a suggested filename for the file
        const contentDisposition = headers.get('Content-Disposition');
        if (!contentDisposition) {
            return null;
        }
        const leadIn = 'UTF-8\'';
        const start = contentDisposition.search(leadIn);
        if (start < 0) {
            return null;
        }

        // Get the 'value' after the filename= part (which may be enclosed in quotes)
        const value = contentDisposition.substring(start + leadIn.length).trim();
        if (value.length === 0) {
            return null;
        }

        // If it's not quoted, we can return the whole thing
        const firstCharacter = value[0];
        if (firstCharacter !== '\"' && firstCharacter !== '\'') {
            return value;
        }

        // If it's quoted, it must have a matching end-quote
        if (value.length < 2) {
            return null;
        }

        // The end-quote must match the opening quote
        const lastCharacter = value[value.length - 1];
        // if (lastCharacter !== firstCharacter) {
        //     return null;
        // }

        // Return the content of the quotes
        return decodeURIComponent(value.substring(1, value.length));
    }

    private getParameterByName(name, url = window.location.href): string {
        const urlParams = new URLSearchParams(new URL(url).search);
        const paramValue = urlParams.get(name);
        return paramValue ? decodeURIComponent(paramValue.replace(/\+/g, ' ')) : null;
    }

    private getFileExtension(filename: string): string{
        // get file extension
        const extension = filename.split('.').pop();
        if(extension){
            return extension.toLocaleLowerCase().trim();
        }
        else{
            return null;
        }
    }
}
