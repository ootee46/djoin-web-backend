import { Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, UntypedFormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AgendaRequestImportModel } from 'app/models/agenda-request-import.model';
import {
    AgendaRequestAttachmentModel,
    AgendaRequestItemListModel,
    AgendaRequestItemModel,
} from 'app/models/agenda-request.model';
import { InputFormData } from 'app/models/input-form-data';
import { MeetingAgendaModel } from 'app/models/meeting-agenda.model';
import { QueryListModel } from 'app/models/query-list.model';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

import { AgendaService } from '../agenda.service';
import { AgendaViewPermissionComponent } from '../view-permission/view-permission.component';

@Component({
    selector: 'meeting-agenda-form2',
    templateUrl: './form2.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class MeetingAgendaForm2Component implements OnInit, OnDestroy {
    @ViewChild('myForm') myForm: NgForm;
    action: string;
    dialogTitle: string;
    listData:  AgendaRequestItemListModel[] = [];
    data: AgendaRequestItemModel = null;
    listData$:  Observable<AgendaRequestItemListModel[]>;
    data$: Observable<AgendaRequestItemModel>;
    agenda: MeetingAgendaModel = null;
    viewOption: number = 1;
    kw: string;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = false;
    private meetingId: number;
    private _unsubscribeAll: Subject<any> = new Subject();
    private _formPopup: MatDialogRef<AgendaViewPermissionComponent>;

    constructor(
        private _matDialogRef: MatDialogRef<MeetingAgendaForm2Component>,
        @Inject(MAT_DIALOG_DATA) private input: InputFormData<MeetingAgendaModel>,
        private _formBuilder: UntypedFormBuilder,
        private _splash: FuseSplashScreenService,
        private _route: ActivatedRoute,
        private _service: AgendaService,
        private _matDialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.action = this.input.action;
        this.agenda = this.input.data;
        this.dialogTitle = (this.action === 'add' ? 'Import Agenda from Agenda Reservation' : 'Update');
        this.listData$ = this._service.agendaReserve$;
        this.data$ = this._service.agendaReserveDetail$;
        this.data$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value: any)=>{ this.data = value;});
        this.listData$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value: any)=>{ this.listData = value;});
        // setTimeout(() => {
        //     this.openChild(20);
        // }, 100);
        if(this.agenda){
            this.meetingId = this.agenda.meetingId;
        }
    }

    openChild(id: number): void{
        this._splash.show();
        this._service.getAgendaReserveDetail(id).pipe(take(1)).subscribe(()=>{
            this._splash.hide();
            this.drawerOpened = true;
        });
    }
    searchAgenda(): void{
        this._splash.show();
        if(this.viewOption === 2){
            this._service.getAgendaReserveWating(this.meetingId).pipe(take(1)).subscribe(()=>{
                this._splash.hide();
            });
        }else{
            this._service.getAgendaReserve(this.meetingId).pipe(take(1)).subscribe(()=>{
                this._splash.hide();
            });
        }
    }
    closeChild(): void{
        this.data = null;
        this.drawerOpened = false;
    }
    openPermission(value: AgendaRequestAttachmentModel): void{
        const inputData: InputFormData<AgendaRequestAttachmentModel> = new InputFormData<AgendaRequestAttachmentModel>();
        inputData.data = value;
        inputData.action = 'add';
        this._formPopup = this._matDialog.open(AgendaViewPermissionComponent, {
            panelClass: 'standard-dialog',
            data: inputData
        });
    }

    importAgenda(): void{
        if(this.data){
            Swal.fire({
                title: '',
                text: 'Do you want to import this agenda?',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            }).then((result) => {
                if(result.isConfirmed){
                    const postData = new AgendaRequestImportModel({});
                    postData.id = this.data.id;
                    postData.meetingId = this.data.meetingId;
                    if(this.agenda && this.agenda.id && this.agenda.id > 0){
                        postData.parentId = this.agenda.id;
                    }else{
                        postData.parentId = null;
                    }
                    this._splash.show();
                    this._service.importReserve(postData).pipe(take(1)).subscribe(()=>{
                        const query = new QueryListModel({});
                        query.catId = this.data.meetingId;
                        this._service.getDatas(query).pipe(take(1)).subscribe(()=>{
                            this._splash.hide();
                            Swal.fire('','Record has been added to Agenda').then(()=>{
                                this._matDialogRef.close();
                            });
                        });
                    });
                }
            });
        }
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
