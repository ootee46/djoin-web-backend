import { AfterContentChecked, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AgendaRequestAttachmentModel, AgendaRequestAttachmentPermissionModel } from 'app/models/agenda-request.model';
import { InputFormData } from 'app/models/input-form-data';
import { Subject } from 'rxjs';

@Component({
    selector: 'dashboard-meeting-approve-attachment-permission',
    templateUrl: './view-permission.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DashboardMinuteApprovePermissionComponent implements OnInit, OnDestroy, AfterContentChecked {
    @ViewChild('myForm') myForm: NgForm;
    action: string;
    data: AgendaRequestAttachmentModel = null;
    permissions: AgendaRequestAttachmentPermissionModel[] = [];
    private _unsubscribeAll: Subject<any> = new Subject();
    constructor(
        private _matDialogRef: MatDialogRef<DashboardMinuteApprovePermissionComponent>,
        @Inject(MAT_DIALOG_DATA) private input: InputFormData<AgendaRequestAttachmentModel>,
        private _formBuilder: UntypedFormBuilder
    ) { }


    ngOnInit(): void {
        this.data = this.input.data;
        this.permissions = this.data.permissions;

    }


    close(): void {
        this._matDialogRef.close();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    ngAfterContentChecked(): void {

    }

}
