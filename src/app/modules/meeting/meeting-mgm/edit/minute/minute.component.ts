import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AgendaModel } from 'app/models/agenda.model';
import { QueryListModel } from 'app/models/query-list.model';
import { Observable, Subject, takeUntil, take } from 'rxjs';
import { MinuteService } from './minute.service';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InputFormData } from 'app/models/input-form-data';
import { MatDrawer } from '@angular/material/sidenav';
import { MeetingMgmService } from '../../meeting-mgm.service';
import { MinuteConfirmFormModel, MinuteConfirmModel, MinuteFormModel, MinuteHistoryModel } from 'app/models/minute.model';
import { ActivatedRoute } from '@angular/router';
import { MeetingModel } from 'app/models/meeting.model';
import { AttachmentModel } from 'app/models/attachment.model';
import Swal from 'sweetalert2';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { MinuteConfirmFormComponent } from './form/form.component';
import { MeetingAgendaModel } from 'app/models/meeting-agenda.model';
import { MinuteRequestFormModel, MinuteRequestModel } from 'app/models/minute-request.model';

@Component({
    selector: 'minute',
    templateUrl: './minute.component.html'
})
export class MinuteComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    datas: MeetingAgendaModel[] = [];
    listData$: Observable<MeetingAgendaModel[]>;
    detailMode: string = null;
    bgSteps = ['bg-sky-200', 'bg-sky-100', 'bg-gray-100', 'bg-gray-100', 'bg-gray-100', 'bg-gray-100', 'bg-gray-100', 'bg-gray-100', 'bg-gray-100', 'bg-gray-100'];
    minuteHistories$: Observable<MinuteHistoryModel[]>;
    minuteConfirms$: Observable<MinuteConfirmModel[]>;
    meeting: MeetingModel = null;
    minuteFile: AttachmentModel;
    minuteRequestFile: AttachmentModel;
    activeAgendaId: number = null;
    minuteDetail$: Observable<MinuteRequestModel>;
    private _formPopup: MatDialogRef<MinuteConfirmFormComponent>;
    private meetingId: number;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _query = new QueryListModel({});
    constructor(
        private _service: MinuteService,
        private _meetingService: MeetingMgmService,
        private _matDialog: MatDialog,
        private _route: ActivatedRoute,
        private _splash: FuseSplashScreenService
    ) { }

    ngOnInit(): void {
        this.minuteDetail$ = this._service.data$;
        this.meetingId = parseInt(this._route.snapshot.paramMap.get('id'), 10);
        if (this.meetingId) {
            this._service.getMinuteHistory(this.meetingId).pipe(take(1)).subscribe();
            this._service.getMinuteConfirm(this.meetingId).pipe(take(1)).subscribe();
        }
        this.minuteHistories$ = this._service.minuteHistories$;
        this.minuteConfirms$ = this._service.minuteConfirms$;
        this._meetingService.data$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
            this.meeting = value;
        });
        this.listData$ = this._service.listData$;
        // this._service.getDatas(this._query).pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe();

        // this._service.listData$.pipe(takeUntil(this._unsubscribeAll)).subscribe((values) => {
        //     if (values) {
        //         this.datas = values;
        //     }

        // });
        this.matDrawer.openedChange.pipe(takeUntil(this._unsubscribeAll))
        .subscribe((value)=>{
            if(!value){
                this.detailMode = null;
                this.activeAgendaId = null;
            }
        });
    }

    submit(): void {
        if (!this.minuteRequestFile) {
            Swal.fire('', 'Please upload file.');
            return;
        }
        if (!this.activeAgendaId) {
            Swal.fire('', 'Information invalid.');
            return;
        }

        Swal.fire({
            title: '',
            text: 'Do you want to send minute of meeting?',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                const postData = new MinuteRequestFormModel({});
                postData.attachment = this.minuteRequestFile;
                postData.agendaId = this.activeAgendaId;
                this._splash.show();
                this._service.submit(postData).pipe(take(1)).subscribe(() => {
                    this._service.getDatas(this.meetingId).pipe(take(1)).subscribe(()=>{
                        this._service.getData(this.activeAgendaId).pipe(take(1)).subscribe(()=>{
                            this._splash.hide();
                            this.minuteRequestFile = null;
                            Swal.fire('', 'Data has been saved.');
                        });
                    });
                });
            }
        });
    }

    openDetail(id: number): void {
        this._splash.show();
        this._service.getData(id).pipe(take(1)).subscribe(()=>{
            this._splash.hide();
            this.activeAgendaId = id;
            this.detailMode = 'agenda';
            this.matDrawer.open();
        });
    }
    closeDetail(): void {
        this.matDrawer.close();
    }

    openMinuteConfirm(): void {
        this.detailMode = 'confirm';
        this.matDrawer.open();
    }
    openMeetingMinute(): void {
        this.detailMode = 'minute';
        this.matDrawer.open();
    }
    openConfirmForm(): void {
        const input = new InputFormData<MinuteConfirmFormModel>();
        const obj = new MinuteConfirmFormModel({});
        obj.meetingId = this.meetingId;
        input.data = obj;
        this._formPopup = this._matDialog.open(MinuteConfirmFormComponent, {
            panelClass: 'standard-dialog',
            width: '100%',
            height: '80vh',
            data: input
        });
        this._formPopup.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((resp: any) => {
            this._service.getMinuteHistory(this.meetingId).pipe(take(1)).subscribe();
            this._service.getMinuteConfirm(this.meetingId).pipe(take(1)).subscribe();
        });
    }
    addMinute(): void {
        if (this.minuteFile) {
            Swal.fire({
                title: '',
                text: 'Do you want to upload minute of meeting?',
                showCancelButton: true,
                confirmButtonText: 'Upload',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    const postData = new MinuteFormModel({});
                    postData.attachmentId = this.minuteFile.id;
                    postData.meetingId = this.meetingId;
                    this._splash.show();
                    this._service.minuteAdd(postData).pipe(take(1)).subscribe(() => {
                        this._splash.hide();
                        Swal.fire('', 'Data has been saved.');
                        this.minuteFile = null;
                        this._meetingService.getData(this.meetingId.toString()).pipe(take(1)).subscribe(() => {
                            this._service.getMinuteHistory(this.meetingId).pipe(take(1)).subscribe();
                        });
                    });
                }
            });
        }
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }


}
