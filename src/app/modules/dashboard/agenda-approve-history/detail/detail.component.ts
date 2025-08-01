import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AgendaRequestAttachmentModel, AgendaRequestItemModel } from 'app/models/agenda-request.model';
import { InputFormData } from 'app/models/input-form-data';
import { UserModel } from 'app/models/user.model';
import { GlobalService } from 'app/services/global.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DashboardAgendaApprovePermissionComponent } from '../view-permission/view-permission.component';

@Component({
    selector: 'dashboard-agenda-approve-detail',
    templateUrl: './detail.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DashboardAgendaApproveDetailComponent implements OnInit, OnDestroy {
    @Input() data$: Observable<AgendaRequestItemModel>;
    data: AgendaRequestItemModel;
    presenters: UserModel[] = [];
    excludeUsers: UserModel[] = [];
    remark: string;
    token: string;
    private _unsubscribeAll: Subject<any> = new Subject();
    private _formPopup: MatDialogRef<DashboardAgendaApprovePermissionComponent>;
    constructor(
        private _matDialog: MatDialog,
        private _globalService: GlobalService
    ) { }

    ngOnInit(): void {
        this.token = this._globalService.accessToken;
        this.data$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
            this.data = value;
            if (this.data) {
                if (value.presenters && value.presenters.length > 0) {
                    this.presenters = value.presenters;
                }
                if (value.excludeUsers && value.excludeUsers.length > 0) {
                    this.excludeUsers = value.excludeUsers;
                }
            }else{
                this.presenters = [];
                this.excludeUsers = [];
            }

        });
    }
    openPermission(value: AgendaRequestAttachmentModel): void {
        const inputData: InputFormData<AgendaRequestAttachmentModel> = new InputFormData<AgendaRequestAttachmentModel>();
        inputData.data = value;
        inputData.action = 'add';
        this._formPopup = this._matDialog.open(DashboardAgendaApprovePermissionComponent, {
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
