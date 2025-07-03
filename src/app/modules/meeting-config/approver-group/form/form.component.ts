import { Component, OnInit, ViewEncapsulation, Inject, OnDestroy, ViewChild, AfterContentChecked } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { InputFormData } from 'app/models/input-form-data';
import { BehaviorSubject, Observable, Subject, take, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ApproverGroupFormModel, ApproverGroupModel } from 'app/models/standard.model';
import { ApproverGroupService } from '../approver-group.service';
import { UserModel } from 'app/models/user.model';
import { CustomValidator } from 'app/validators/custom.validate';

@Component({
    selector: 'approver-group-form',
    templateUrl: './form.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ApproverGroupFormComponent implements OnInit, OnDestroy {
    @ViewChild('myForm') myForm: NgForm;
    action: string;
    dialogTitle: string;
    data: ApproverGroupModel;
    dataForm: UntypedFormGroup;
    kw: string;
    allUsers: UserModel[] = [];
    sourceUsers: UserModel[] = [];
    selectedUsers: UserModel[] = [];
    private _unsubscribeAll: Subject<any> = new Subject();
    private _sourceUsers: BehaviorSubject<UserModel[] | null> = new BehaviorSubject([]);
    private _selectedUsers: BehaviorSubject<UserModel[] | null> = new BehaviorSubject([]);
    constructor(
        private _matDialogRef: MatDialogRef<ApproverGroupFormComponent>,
        @Inject(MAT_DIALOG_DATA) private input: InputFormData<ApproverGroupModel>,
        private _matDialog: MatDialog,
        private _formBuilder: UntypedFormBuilder,
        private _service: ApproverGroupService
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
            if(this.data.users && this.data.users.length > 0){
                this.dataForm.get('users').patchValue(this.data.users.map(c=>c.id));
            }
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
        this.dataForm.get('users').patchValue(selectMemberId);
        this.dataForm.get('users').updateValueAndValidity();
        let sourceMembers = this.allUsers.filter(c => selectMemberId.findIndex(a => a === c.id) === -1);
        if (this.kw) {
            sourceMembers = sourceMembers.filter((c: UserModel) => c.name.toLowerCase().indexOf(this.kw.toLowerCase()) > -1);
        }
        this._sourceUsers.next(sourceMembers);
    }
    filterUser(): void {
        this.updateSourceMember(this._selectedUsers.getValue());
    }
    addUsers(id: number): void {
        const selectUsers = this._selectedUsers.getValue();
        const selectedUser = this.allUsers.find(c => c.id === id);
        const isExistData = selectUsers.findIndex(c => c.id === id) > -1;
        if (!isExistData && selectedUser) {
            selectUsers.push(selectedUser);
            this._selectedUsers.next(selectUsers);
        }
    }
    removeUser(id: number): void {
        let selectUsers = this._selectedUsers.getValue();
        selectUsers = selectUsers.filter(c => c.id !== id);
        this._selectedUsers.next(selectUsers);
    }
    clearSearch(): void {
        this.kw = null;
        this.updateSourceMember(this._selectedUsers.getValue());
    }
    createDataForm(): UntypedFormGroup {
        return this._formBuilder.group({
            'id': [this.data.id || 0 ,[Validators.required]],
            'title': [this.data.title, [Validators.required, CustomValidator.whiteSpace, Validators.maxLength(90)]],
            'active': [this.data.active, [Validators.required]],
            'users': [this.data.users, [Validators.required]]
        });
    }
    saveData(): void {
        if (this.dataForm.valid) {
            const postData = new ApproverGroupFormModel(this.dataForm.getRawValue());
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
                    if (this.action === 'edit') {
                        this._service.update(postData).pipe(take(1)).subscribe({
                            next: (resp: any) => {
                                Swal.fire('', 'Data has been saved.').then(() => {
                                    this.dataForm.enable();
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
                    else {
                        this._service.create(postData).pipe(take(1)).subscribe({
                            next: (resp: any) => {
                                Swal.fire('', 'Data has been saved.').then(() => {
                                    this.dataForm.enable();
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
                }
            });
        }
    }
    close(): void {
        this._matDialogRef.close();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
