import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AgendaRequestAttachmentModel } from 'app/models/agenda-request.model';
import { ApproveFormModel } from 'app/models/approve-form.model';
import { MeetingAttachmentModel } from 'app/models/attachment.model';
import { InputFormData } from 'app/models/input-form-data';
import { MinuteRequestModel } from 'app/models/minute-request.model';
import { UserModel } from 'app/models/user.model';
import { GlobalService } from 'app/services/global.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { DashboardMinuteApprovePermissionComponent } from '../view-permission/view-permission.component';

@Component({
    selector: 'dashboard-minute-approve-detail',
    templateUrl: './detail.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DashboardMinuteApproveDetailComponent implements OnInit, OnDestroy {
   @Input() data$: Observable<MinuteRequestModel>;
    data: MinuteRequestModel;
    presenters: UserModel[] = [];
    excludeUsers: UserModel[] = [];
    remark: string;
    token: string;
    private _unsubscribeAll: Subject<any> = new Subject();
    private _formPopup: MatDialogRef<DashboardMinuteApprovePermissionComponent>;
    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _matDialog: MatDialog,
        private _globalService: GlobalService
    ) { }

    ngOnInit(): void {
        this.token = this._globalService.accessToken;
        this.data$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
            if(value == null){
                this.data = new MinuteRequestModel({});
                return;
            }
            this.data = value;
            if (value.agenda.presenters && value.agenda.presenters.length > 0) {
                this.presenters = value.agenda.presenters.map((c)=>{
                    const obj = new UserModel({});
                    obj.id = c.id;
                    obj.name = c.name;
                    return obj;
                });
            }
            if (value.agenda.excludeUsers && value.agenda.excludeUsers.length > 0) {
                this.excludeUsers = value.agenda.excludeUsers.map((c)=>{
                    const obj = new UserModel({});
                    obj.id = c.id;
                    obj.name = c.name;
                    return obj;
                });
            }
        });
    }
    openPermission(value: MeetingAttachmentModel): void {
        const inputData: InputFormData<MeetingAttachmentModel> = new InputFormData<MeetingAttachmentModel>();
        inputData.data = value;
        inputData.action = 'add';
        this._formPopup = this._matDialog.open(DashboardMinuteApprovePermissionComponent, {
            panelClass: 'standard-dialog',
            data: inputData
        });
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
