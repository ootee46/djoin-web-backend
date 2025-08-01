import { Component, OnInit, ViewEncapsulation, Inject, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators, ValidationErrors } from '@angular/forms';
import { MatDialogRef,MatDialog,  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { InputFormData } from 'app/models/input-form-data';
import { Observable, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { UserDataService } from '../user.service';
import { ApproverUserModel, UserModel } from 'app/models/user.model';
import { ActiveDirectorySearchComponent } from 'app/modules/shares/active-directory-search/active-directory-search.component';
import { ApproverUserFormModel, UserFormModel } from 'app/models/user-form.model';
import { LdapDataModel } from 'app/models/ldap-data.model';
import { MeetingRoomModel } from 'app/models/meeting-room.model';
import moment from 'moment';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { CustomValidator } from 'app/validators/custom.validate';
import { UserGroupModel } from 'app/models/user-group.model';
@Component({
    selector: 'user-form',
    templateUrl: './form.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class UserFormComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('myForm') myForm: NgForm;
    action: string;
    dialogTitle: string;
    data: UserModel;
    dataForm: UntypedFormGroup;
    isLdap: boolean = true;
    meetingRooms$: Observable<MeetingRoomModel[]>;
    userGroups$: Observable<UserGroupModel[]>;
    approverForms: ApproverUserModel[] = [];
    allUsers: UserModel[] = [];
    userInfo: User;
    minDate: Date = moment().add(1,'day').toDate();
    private _unsubscribeAll: Subject<any> = new Subject();
    private _popupEmployee: MatDialogRef<ActiveDirectorySearchComponent>;
    constructor(
        private _matDialogRef: MatDialogRef<UserFormComponent>,
        private _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) private input: InputFormData<UserModel>,
        private _formBuilder: UntypedFormBuilder,
        private _service: UserDataService,
        private _userService: UserService,
    ) {

    }

    ngAfterViewInit(): void {
        if(this.action !== 'add'){
            this.dataForm.updateValueAndValidity();
                Object.keys(this.dataForm.controls).forEach((field) => {
                    const control = this.dataForm.get(field);
                    control.markAsTouched({ onlySelf: true });
                 });
        }
    }
    ngOnInit(): void {
        this.action = this.input.action;
        this.dialogTitle = (this.action === 'add' ? 'New' : 'Update');
        this.data = this.input.data;
        this.dataForm = this.createDataForm();
        this.meetingRooms$ = this._service.meetingRooms$;
        this.userGroups$ = this._service.userGroups$;

        if(this.action !== 'add'){
            this.dataForm.updateValueAndValidity();
                Object.keys(this.dataForm.controls).forEach((field) => {
                    const control = this.dataForm.get(field);
                    control.markAsTouched({ onlySelf: true });
                 });
        }

        this._service.approverPositions$.pipe(takeUntil(this._unsubscribeAll)).subscribe((values)=>{
            values.forEach((item) => {
                const obj = new ApproverUserModel({});
                obj.id = 0;
                obj.approverPositionId = item.id;
                obj.positionTitle = item.title;
                const existData = this.data.approvers.find(c=>c.approverPositionId === item.id);
                if(existData){
                    obj.approverId = existData.approverId;
                }
                this.approverForms.push(obj);
            });
        });

        this._service.users$.pipe(takeUntil(this._unsubscribeAll)).subscribe((values)=>{
            this.allUsers = values;
        });
        this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value)=>{
            this.userInfo = value;
        });
        this.dataForm.get('allMeetingRoom').valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((value)=>{
            if(this.dataForm.get('userLevel').value === 1 || this.dataForm.get('userLevel').value === 2){
                if(value === true){
                    this.dataForm.get('meetingRooms').removeValidators([Validators.required]);
                }else{
                    this.dataForm.get('meetingRooms').addValidators([Validators.required]);
                }
            }else{
                this.dataForm.get('meetingRooms').removeValidators([Validators.required]);
            }

            this.dataForm.get('meetingRooms').updateValueAndValidity();

        });

        this.dataForm.get('userLevel').valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((value)=>{
            if(this.dataForm.get('allMeetingRoom').value === false){
                if(value === 1 || value === 2){
                    this.dataForm.get('meetingRooms').addValidators([Validators.required]);
                }
                else{
                    this.dataForm.get('meetingRooms').removeValidators([Validators.required]);
                }
            }else{
                this.dataForm.get('meetingRooms').removeValidators([Validators.required]);
            }
            this.dataForm.get('meetingRooms').updateValueAndValidity();
        });

        this.dataForm.get('isLdap').valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((value)=>{
            if(value === true){
                this.dataForm.get('ldapId').addValidators([Validators.required]);
                this.dataForm.get('password').patchValue(null);
                this.dataForm.get('passwordExpire').patchValue(null);
                this.dataForm.get('password').removeValidators([Validators.required]);
                this.dataForm.get('passwordExpire').removeValidators([Validators.required]);
            }else{
                this.dataForm.get('ldapId').removeValidators([Validators.required]);
                this.dataForm.get('passwordExpire').addValidators([Validators.required]);
                if(this.action === 'add')
                {
                    this.dataForm.get('password').patchValue(null);
                    this.dataForm.get('password').addValidators([Validators.required]);
                }else{
                    this.dataForm.get('password').patchValue(null);
                    this.dataForm.get('password').removeValidators([Validators.required]);
                }
            }
            this.dataForm.get('ldapId').updateValueAndValidity();
            this.dataForm.get('password').updateValueAndValidity();
            this.dataForm.get('passwordExpire').updateValueAndValidity();
        });
        // this.dataForm.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((value)=>{
        //     Object.keys(this.dataForm.controls).forEach((key) => {
        //         const controlErrors: ValidationErrors = this.dataForm.get(key).errors;
        //         if (controlErrors != null) {
        //           Object.keys(controlErrors).forEach((keyError) => {
        //            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        //           });
        //         }
        //       });
        // });

        //this.openSearch();
    }
    createDataForm(): UntypedFormGroup {
        return this._formBuilder.group({
            'id':[this.data.id || 0 , [Validators.required]],
            'name': [this.data.name],
            'titleName': [this.data.titleName,[Validators.required]],
            'firstName':[this.data.firstName,[Validators.required, CustomValidator.whiteSpace, Validators.maxLength(150)]],
            'lastName':[this.data.lastName,[Validators.required, CustomValidator.whiteSpace, Validators.maxLength(150)]],
            'userName':[this.data.userName,[Validators.required, CustomValidator.whiteSpace, Validators.maxLength(40), CustomValidator.username]],
            'password':[null, [CustomValidator.strongPassword, Validators.maxLength(40),(!this.data.isLdap && this.action === 'add' ? Validators.required : Validators.nullValidator),CustomValidator.whiteSpace, Validators.minLength(8)]],
            'isLdap':[(this.data.isLdap != null ? this.data.isLdap : true), [Validators.required]],
            'jobTitle':[this.data.jobTitle, [ CustomValidator.whiteSpace, Validators.maxLength(150)]],
            'department':[this.data.department, [ CustomValidator.whiteSpace, Validators.maxLength(150)]],
            'company':[this.data.company, [ CustomValidator.whiteSpace, Validators.maxLength(150)]],
            'officePhone':[this.data.officePhone, [ CustomValidator.whiteSpace, Validators.maxLength(40)]],
            'mobilePhone':[this.data.mobilePhone, [ CustomValidator.whiteSpace, Validators.maxLength(40)]],
            'email':[this.data.email, [Validators.required,Validators.email, CustomValidator.whiteSpace, Validators.maxLength(150)]],
            'userLevel':[this.data.userLevel, [Validators.required]],
            'ldapId':[this.data.ldapId,[(this.data.isLdap ? Validators.required : Validators.nullValidator)]],
            'allMeetingRoom':[this.data.allMeetingRoom, [Validators.required]],
            'passwordExpire':[(this.data.passwordExpire ? this.data.passwordExpire : moment().add(3,'month').format('YYYY-MM-DD')), (!this.data.isLdap ? [CustomValidator.futureDate,Validators.required  ]: [Validators.nullValidator])],
            'accountExpire':[(this.data.accountExpire ? this.data.accountExpire : moment().add(3,'month').format('YYYY-MM-DD')), [Validators.required, CustomValidator.futureDate]],
            'meetingRooms':[this.data.meetingRooms.map(c=>c.id)],
            'userGroups':[this.data.userGroups.map(c=>c.id)],
            'active':[this.data.active, [Validators.required]],
        });
    }

    openSearch(): void{
        this._popupEmployee = this._matDialog.open(ActiveDirectorySearchComponent,{
            width:'80%',
            height:'70%',
        });
        this._popupEmployee.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((value: LdapDataModel) =>{
            if(value){
                this.dataForm.get('name').patchValue(value.displayName);
                this.dataForm.get('userName').patchValue(value.prefixDomain + '\\' + value.samAccountName);
                this.dataForm.get('ldapId').patchValue(value.ldapId);
                this.dataForm.get('firstName').patchValue(value.givenName);
                this.dataForm.get('lastName').patchValue(value.surname);
                this.dataForm.get('email').patchValue(value.emailAddress);
            }
            else{
                this.dataForm.get('name').patchValue(null);
                this.dataForm.get('userName').patchValue(null);
                this.dataForm.get('ldapId').patchValue(null);
                this.dataForm.get('firstName').patchValue(null);
                this.dataForm.get('lastName').patchValue(null);
                this.dataForm.get('email').patchValue(null);
            }
        });
    }
    saveData(): void{
        if(this.action === 'add'){this.create();}else{this.update();}
    }
    create(): void {
        if (this.dataForm.valid) {
            const postData = new UserFormModel(this.dataForm.getRawValue());
            if(postData.userLevel !== 1 && postData.userLevel !== 2){
                postData.meetingRooms = [];
                postData.allMeetingRoom = false;
            }
            postData.approvers = this.approverForms.filter(c=>c.approverId).map((c: any)=>new ApproverUserFormModel(c));

            Swal.fire({
                title: '',
                text: (this.action === 'edit' ?'Do you want to save your changes ?':'Do you want to save?'),
                showCancelButton: true,
                confirmButtonText: 'Save',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if(result.isConfirmed){
                    this.dataForm.disable();
                    this._service.create(postData).subscribe({
                        next: (resp: any)=>{
                            Swal.fire('','Data has been saved.').then(()=>{
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
            const postData = new UserFormModel(this.dataForm.getRawValue());
            if(postData.userLevel !== 1 && postData.userLevel !== 2){
                postData.meetingRooms = [];
                postData.allMeetingRoom = false;
            }
            postData.approvers = this.approverForms.filter(c=>c.approverId).map((c: any)=>new ApproverUserFormModel(c));
            Swal.fire({
                title: '',
                text: 'Do you want to save your changes ?',
                showCancelButton: true,
                confirmButtonText: 'Save',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if(result.isConfirmed){
                    this.dataForm.disable();
                    this._service.update(postData).subscribe({
                        next: (resp: UserModel)=>{
                            Swal.fire('','Data has been saved.').then(()=>{
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
    close(): void{
        this._matDialogRef.close();
    }


    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
