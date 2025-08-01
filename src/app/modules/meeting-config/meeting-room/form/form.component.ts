import { Component, OnInit, ViewEncapsulation, Inject, OnDestroy, ViewChild, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { InputFormData } from 'app/models/input-form-data';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { MeetingRoomFormModel, MeetingRoomModel } from 'app/models/meeting-room.model';
import { MeetingRoomService } from '../meeting-room.service';
import { UserModel } from 'app/models/user.model';
import { CustomValidator } from 'app/validators/custom.validate';

@Component({
    selector: 'meeting-room-form',
    templateUrl: './form.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class MeetingRoomFormComponent implements OnInit, OnDestroy, AfterContentChecked {
    @ViewChild('myForm') myForm: NgForm;
    action: string;
    dialogTitle: string;
    data: MeetingRoomModel;
    dataForm: UntypedFormGroup;
    kw: string;
    roomColor: string;
    adminUsers: UserModel[] = [];
    sourceAdminUsers: UserModel[] = [];
    selectedAdminUsers: UserModel[] = [];
    private _sourceAdminUsers: BehaviorSubject<UserModel[] | null> = new BehaviorSubject([]);
    private _selectedAdminUsers: BehaviorSubject<UserModel[] | null> = new BehaviorSubject([]);
    private _unsubscribeAll: Subject<any> = new Subject();
    constructor(
        private _matDialogRef: MatDialogRef<MeetingRoomFormComponent>,
        @Inject(MAT_DIALOG_DATA) private input: InputFormData<MeetingRoomModel>,
        private _formBuilder: UntypedFormBuilder,
        private _service: MeetingRoomService
    ) { }
    get sourceAdminUsers$(): Observable<UserModel[]> {
        return this._sourceAdminUsers.asObservable();
    }
    get selectedAdminUsers$(): Observable<UserModel[]> {
        return this._selectedAdminUsers.asObservable();
    }

    ngOnInit(): void {
        this.kw = null;
        this.action = this.input.action;
        this.dialogTitle = (this.action === 'add' ? 'New' : 'Update');
        this.data = this.input.data;
        this.dataForm = this.createDataForm();
        this.roomColor = this.data.color;
        if (this.data && this.data !== null && this.data.users !== null && Array.isArray(this.data.users)) {
            this._selectedAdminUsers.next(this.data.users);
            this._service.adminUsers$.pipe(takeUntil(this._unsubscribeAll)).subscribe((values) => {
                this.adminUsers = values;
            });
            this.selectedAdminUsers$.pipe(takeUntil(this._unsubscribeAll)).subscribe((values) => {
                this.updateSourceAdminMember(values);
            });
        }
    }
    updateSourceAdminMember(selectUsers: UserModel[]): void {
        const selectMemberId = selectUsers.map(c => c.id);
        let sourceMembers = this.adminUsers.filter(c => selectMemberId.findIndex(a => a === c.id) === -1);
        if (this.kw) {
            sourceMembers = sourceMembers.filter((c: UserModel) => c.name.toLowerCase().indexOf(this.kw.toLowerCase()) > -1);
        }
        this._sourceAdminUsers.next(sourceMembers);
    }
    filterAdminUser(): void {
        this.updateSourceAdminMember(this._selectedAdminUsers.getValue());
    }
    addAdminUsers(id: number): void {
        const selectAdminUsers = this._selectedAdminUsers.getValue();
        const selectedAdminUser = this.adminUsers.find(c => c.id === id);
        const isExistData = selectAdminUsers.findIndex(c => c.id === id) > -1;
        if (!isExistData && selectedAdminUser) {
            selectAdminUsers.push(selectedAdminUser);
            this._selectedAdminUsers.next(selectAdminUsers);
        }
    }
    removeAdminUser(id: number): void {
        let selectAdminUsers = this._selectedAdminUsers.getValue();
        selectAdminUsers = selectAdminUsers.filter(c => c.id !== id);
        this._selectedAdminUsers.next(selectAdminUsers);
    }
    createDataForm(): UntypedFormGroup {
        return this._formBuilder.group({
            'id': [this.data.id || 0 ,[Validators.required]],
            'name': [this.data.name, [Validators.required,CustomValidator.whiteSpace, Validators.maxLength(90)]],
            'color': [this.data.color, [Validators.required]],
            'colorClass': [this.data.colorClass],
            'users': [this.data.users],
            'active': [this.data.active, [Validators.required]]
        });
    }
    clearSearch(): void {
        this.kw = null;
        this.updateSourceAdminMember(this._selectedAdminUsers.getValue());
    }
    saveData(): void {
        if (this.action === 'add') { this.create(); } else { this.update(); }
    }
    create(): void {
        if (this.dataForm.valid) {
            const postData = new MeetingRoomFormModel(this.dataForm.getRawValue());
            postData.users = this._selectedAdminUsers.getValue().map(c => c.id);
            Swal.fire({
                title: '',
                text: (this.action === 'edit' ?'Do you want to save your changes ?':'Do you want to save?'),
                showCancelButton: true,
                confirmButtonText: 'Save',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.dataForm.disable();
                    this._service.create(postData).subscribe({
                        next: (resp: MeetingRoomModel) => {
                            Swal.fire('', 'Data has been saved.').then(() => {
                                this._matDialogRef.close(resp);
                            });
                        },
                        error: () => {
                            this.dataForm.enable();
                        }
                    });
                }
            });
        }
    }
    update(): void {
        if (this.dataForm.valid) {
            const postData = new MeetingRoomFormModel(this.dataForm.getRawValue());
            postData.users = this._selectedAdminUsers.getValue().map(c => c.id);
            Swal.fire({
                title: '',
                text: 'Do you want to save your changes ?',
                showCancelButton: true,
                confirmButtonText: 'Save',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.dataForm.disable();
                    this._service.update(postData).subscribe({
                        next: (resp: MeetingRoomModel) => {
                            Swal.fire('', 'Data has been saved.').then(() => {
                                this._matDialogRef.close(resp);
                            });
                        },
                        error: () => {
                            setTimeout(() => {
                                this.dataForm.enable();
                            }, 0);
                        }
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
    changeColor(event: any): void{
      this.dataForm.get('color').patchValue(event);
    }
    ngAfterContentChecked(): void {

    }

}
