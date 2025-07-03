import { Component, OnInit, ViewEncapsulation, Inject, OnDestroy, ViewChild, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { InputFormData } from 'app/models/input-form-data';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { UserGroupFormModel, UserGroupModel } from 'app/models/user-group.model';
import { UserGroupService } from '../user-group.service';
import { UserModel } from 'app/models/user.model';
import { CustomValidator } from 'app/validators/custom.validate';

@Component({
    selector: 'user-group-form',
    templateUrl: './form.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class UserGroupFormComponent implements OnInit, OnDestroy, AfterContentChecked {
    @ViewChild('myForm') myForm: NgForm;
    action: string;
    dialogTitle: string;
    data: UserGroupModel;
    dataForm: UntypedFormGroup;
    kw: string;
    allUsers: UserModel[] = [];
    sourceUsers: UserModel[] = [];
    selectedUsers: UserModel[] = [];
    private _sourceUsers: BehaviorSubject<UserModel[] | null> = new BehaviorSubject([]);
    private _selectedUsers: BehaviorSubject<UserModel[] | null> = new BehaviorSubject([]);
    private _unsubscribeAll: Subject<any> = new Subject();
    constructor(
        private _matDialogRef: MatDialogRef<UserGroupFormComponent>,
        @Inject(MAT_DIALOG_DATA) private input: InputFormData<UserGroupModel>,
        private _formBuilder: UntypedFormBuilder,
        private _service: UserGroupService
    ) { }
    get sourceUsers$(): Observable<UserModel[]> {
        return this._sourceUsers.asObservable();
    }
    get selectedUsers$(): Observable<UserModel[]> {
        return this._selectedUsers.asObservable();
    }

    ngOnInit(): void {
        this.kw = null;
        this.action = this.input.action;
        this.dialogTitle = (this.action === 'add' ? 'New' : 'Update');
        this.data = this.input.data;
        this.dataForm = this.createDataForm();
        if (this.data != null && this.data.users != null && Array.isArray(this.data.users)) {
            this._selectedUsers.next(this.data.users);
        }
        this._service.allUsers$.pipe(takeUntil(this._unsubscribeAll)).subscribe((values) => {
            this.allUsers = values;
        });
        this.selectedUsers$.pipe(takeUntil(this._unsubscribeAll)).subscribe((values) => {
            this.updateSourceMember(values);
        });
    }
    updateSourceMember(selectUsers: UserModel[]): void {
        const selectMemberId = selectUsers.map(c => c.id);
        let sourceMembers = this.allUsers.filter(c => selectMemberId.findIndex(a => a === c.id) === -1);
        if (this.kw) {
            sourceMembers = sourceMembers.filter((c: UserModel) => c.name.toLowerCase().indexOf(this.kw.toLowerCase()) > -1);
        }
        this._sourceUsers.next(sourceMembers);
    }
    filterAdminUser(): void {
        this.updateSourceMember(this._selectedUsers.getValue());
    }
    addUsers(id: number): void {
        const selectAdminUsers = this._selectedUsers.getValue();
        const selectedAdminUser = this.allUsers.find(c => c.id === id);
        const isExistData = selectAdminUsers.findIndex(c => c.id === id) > -1;
        if (!isExistData && selectedAdminUser) {
            selectAdminUsers.push(selectedAdminUser);
            this._selectedUsers.next(selectAdminUsers);
        }
    }
    removeUser(id: number): void {
        let selectAdminUsers = this._selectedUsers.getValue();
        selectAdminUsers = selectAdminUsers.filter(c => c.id !== id);
        this._selectedUsers.next(selectAdminUsers);
    }
    createDataForm(): UntypedFormGroup {
        return this._formBuilder.group({
            'id': [this.data.id || 0 ,[Validators.required]],
            'name': [this.data.name, [Validators.required, CustomValidator.whiteSpace, Validators.maxLength(90)]],
            'active': [this.data.active, [Validators.required]],
            'users': [this.data.users]
        });
    }
    clearSearch(): void {
        this.kw = null;
        this.updateSourceMember(this._selectedUsers.getValue());
    }
    saveData(): void {
        if (this.action === 'add') { this.create(); } else { this.update(); }
    }
    create(): void {
        if (this.dataForm.valid) {
            const postData = new UserGroupFormModel(this.dataForm.getRawValue());
            postData.users = this._selectedUsers.getValue().map(c=>c.id);
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
                        next: (resp: UserGroupModel) => {
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
            const postData = new UserGroupFormModel(this.dataForm.getRawValue());
            postData.users = this._selectedUsers.getValue().map(c => c.id);
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
                        next: (resp: UserGroupModel) => {
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
