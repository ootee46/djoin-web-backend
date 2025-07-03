import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { PackageInfoModel } from 'app/models/package-info.model';
import { Observable, Subject, takeUntil } from 'rxjs';

import { DashboardService } from '../dashboard.service';
import { LineApproveModel } from 'app/models/line-approve.model';
import { InputFormData } from 'app/models/input-form-data';
import { AgendaRequestModel } from 'app/models/agenda-request.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AgendaReserveFormComponent } from 'app/modules/meeting/agenda-reserve/form/form.component';

@Component({
    selector: 'dashboard-package-info',
    templateUrl: './package-info.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DashboardPackageInfoComponent implements OnInit, OnDestroy {
    data$: Observable<PackageInfoModel>;
    user$: Observable<User>;
    user: User;
    lineApprove: LineApproveModel[];
    private _unsubscribeAll: Subject<any> = new Subject();
    private _formPopup: MatDialogRef<AgendaReserveFormComponent>;
    constructor(
        private _service: DashboardService,
        private _matDialog: MatDialog,
        private _userService: UserService
    ) {}

    ngOnInit(): void {
        this.data$ = this._service.packageInfo$;

        this.user$ = this._userService.get();
        this.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
            this.user = value;
        });
        this.loadLineApprove();
    }

    loadLineApprove(): void {
        this._service
            .getLineApprove()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((value: LineApproveModel[]) => {
                this.lineApprove = value;
            });
    }

    create(): void {
        const inputData: InputFormData<AgendaRequestModel> =
            new InputFormData<AgendaRequestModel>();
        inputData.data = new AgendaRequestModel({});
        inputData.action = 'add';
        this.openForm(inputData);
    }

    openForm(input: InputFormData<AgendaRequestModel>): void {
        this._formPopup = this._matDialog.open(AgendaReserveFormComponent, {
            panelClass: 'standard-dialog',
            width: '100%',
            height: '99%',
            data: input,
        });
        this._formPopup
            .afterClosed()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((resp: any) => {
                // this.loadData();
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
