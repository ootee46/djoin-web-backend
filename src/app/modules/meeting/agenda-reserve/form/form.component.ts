/* eslint-disable max-len */
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AfterContentChecked, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AgendaRequestFormModel } from 'app/models/agenda-request-form.model';
import { AgendaReserveModel } from 'app/models/agenda-reserve.model';
import { InputFormData } from 'app/models/input-form-data';
import { MeetingListModel } from 'app/models/meeting.model';
import { StandardModel } from 'app/models/standard.model';
import { UserModel } from 'app/models/user.model';
import { CustomValidator } from 'app/validators/custom.validate';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { AgendaReserveService } from '../agenda-reserve.service';

@Component({
    selector: 'agenda-reserve-form',
    templateUrl: './form.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AgendaReserveFormComponent
    implements OnInit, OnDestroy, AfterContentChecked
{
    @ViewChild('myForm') myForm: NgForm;
    action: string;
    dialogTitle: string;
    data: AgendaReserveModel;
    dataForm: UntypedFormGroup;
    kw: string;
    kw2: string;
    allMeetings: MeetingListModel[] = [];
    meetings: MeetingListModel[] = [];
    selectedMeetings: MeetingListModel[] = [];
    allUsers: UserModel[];
    formStep: number = 1;
    agendaRequestForms: AgendaRequestFormModel[] = [];
    confidentials$: Observable<StandardModel[]>;
    objectives$: Observable<StandardModel[]>;
    _filterMeetings: BehaviorSubject<MeetingListModel[] | null> = new BehaviorSubject([]);
    _filterSelectMeetings: BehaviorSubject<MeetingListModel[] | null> = new BehaviorSubject([]);
    private _unsubscribeAll: Subject<any> = new Subject();

    constructor(
        private _matDialogRef: MatDialogRef<AgendaReserveFormComponent>,
        @Inject(MAT_DIALOG_DATA)
        private input: InputFormData<AgendaReserveModel>,
        private _formBuilder: UntypedFormBuilder,
        private _service: AgendaReserveService
    ) {
    }

    get filterMeetings$(): Observable<MeetingListModel[]> {
        return this._filterMeetings.asObservable();
    }
    get filterSelectMeetings$(): Observable<MeetingListModel[]> {
        return this._filterSelectMeetings.asObservable();
    }

    get requests(): UntypedFormArray {
        return this.dataForm.get('requests') as UntypedFormArray;
    }

    ngOnInit(): void {
        this._service.meetings$.pipe(takeUntil(this._unsubscribeAll))
        .subscribe((value)=>{
            this.allMeetings = value;
            this.meetings = this.allMeetings;
            this._filterMeetings.next(this.meetings);
        });
        this.confidentials$ = this._service.confidentials$;
        this.objectives$ = this._service.objectives$;
        this._service.users$.pipe(takeUntil(this._unsubscribeAll))
        .subscribe((value)=>{
            this.allUsers = value;
        });

        this.kw = null;
        this.action = this.input.action;
        this.dialogTitle =
            this.action === 'add'
                ? 'Create New Agenda Reservation'
                : 'Update';
        this.data = this.input.data;
        this.dataForm = this.createDataForm();
        // this._service.getMeeting().pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((values) => {
        //         if (values) {
        //             this.meetings = values;
        //             this.allMeetings = values;
        //         }
        //     });
    }

    filterData(): void{
        if(this.kw != null && this.kw.trim() !== '')
        {
            const kw = this.kw.trim();
            const searchData = this.meetings.filter(c=>c.title.toLowerCase().indexOf(kw.toLowerCase()) > -1);
            this._filterMeetings.next(searchData);
        }else{
            this._filterMeetings.next(this.meetings);
        }
    }

    filterSelect(): void{
        if(this.kw2 != null && this.kw2.trim() !== '')
        {
            const kw = this.kw2.trim();
            const searchData = this.selectedMeetings.filter(c=>c.title.toLowerCase().indexOf(kw.toLowerCase()) > -1);
            this._filterSelectMeetings.next(searchData);
        }else{
            this._filterSelectMeetings.next(this.selectedMeetings);
        }
    }

    createDataForm(): UntypedFormGroup {
        return this._formBuilder.group({
            id: [this.data.id,0],
            requests: this._formBuilder.array([]),
        });
    }

    addRequest(item: AgendaRequestFormModel): void {
        const requestForm = this._formBuilder.group({
            id:[item.id, [Validators.required]],
            meetingId:[item.meetingId, [Validators.required]],
            agendaObjectiveId:[item.agendaObjectiveId, [Validators.required]],
            agendaConfidentialId:[item.agendaConfidentialId, [Validators.required]],
            title:[item.title, [Validators.required, Validators.maxLength(900), CustomValidator.whiteSpace]],
            useTime:[item.useTime !== 0 ? item.useTime : null],
            description:[item.description, [Validators.required, Validators.maxLength(2000), CustomValidator.whiteSpace]],
            presenters:[[]],
            excludeUsers:[[]],
            bookingDetail:[item.bookingDetail],
        });
        this.requests.push(requestForm);
    }
    drop(event: CdkDragDrop<MeetingListModel[]>): void {
        if (event.previousContainer === event.container) {
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        }
    }
    goStep(step: number): void {
        if(step === 2 && this.selectedMeetings.length <= 0){
            Swal.fire('','Please select meeting');
            return;
        }
        else if(step === 2 && this.selectedMeetings.length > 0){
            this.agendaRequestForms = this.selectedMeetings.map(c=>new AgendaRequestFormModel(c));
            this.agendaRequestForms.forEach((item)=>{
                this.addRequest(item);
                item.optionPresenters.next(this.allUsers);
                item.optionExcludeUsers.next(item.attendees);
            });
            this.formStep = step;
        }
        else if(step === 1){
            this.requests.clear();
            this.formStep = step;
        }
        else{
            this.formStep = step;
        }

    }
    addItem(item: MeetingListModel): void {
        this.selectedMeetings.push(item);
        this.kw2 = null;

        this.meetings = this.allMeetings.filter(
            (c: any) => !this.selectedMeetings.includes(c)
        );
        this.filterSelect();
        this.filterData();
    }

    removeItem(item: MeetingListModel): void {
        //console.log(item);
        this.selectedMeetings = this.selectedMeetings.filter((c: any) => c !== item);
        this.meetings = this.allMeetings.filter(
            (c: any) => !this.selectedMeetings.includes(c)
        );
        this.filterSelect();
        this.filterData();
    }
    addPresenter(index: number): void{
        this.agendaRequestForms[index].excludeUserId = null;
        const existItem = this.agendaRequestForms[index].selectedPresenters.find(c=>c.id === this.agendaRequestForms[index].presenterId);
        if(existItem == null){
            const objItem = this.allUsers.find(c=>c.id === this.agendaRequestForms[index].presenterId);
            if(objItem != null){
                this.agendaRequestForms[index].selectedPresenters.push(objItem);
                this.agendaRequestForms[index].optionPresenters.next(this.allUsers.filter(c=>this.agendaRequestForms[index].selectedPresenters.findIndex(a=>a.id === c.id) === -1));
                this.agendaRequestForms[index].optionExcludeUsers.next(this.agendaRequestForms[index].attendees.filter(c=>this.agendaRequestForms[index].selectedExcludeUsers.findIndex(a=>a.id === c.id) === -1)
                .filter(c=>this.agendaRequestForms[index].selectedPresenters.findIndex(a=>a.id === c.id) === -1)
                );
                this.agendaRequestForms[index].presenterId = null;
                this.updatePresenterForm(index,this.agendaRequestForms[index].selectedPresenters.map(c=>c.id));
            }
        }
    }
    removePresenter(index: number, value: UserModel): void{
        this.agendaRequestForms[index].excludeUserId = null;
        this.agendaRequestForms[index].selectedPresenters = this.agendaRequestForms[index].selectedPresenters.filter(c=>c.id !== value.id);
        this.agendaRequestForms[index].optionPresenters.next(this.allUsers.filter(c=>this.agendaRequestForms[index].selectedPresenters.findIndex(a=>a.id === c.id) === -1));
        this.agendaRequestForms[index].optionExcludeUsers.next(this.agendaRequestForms[index].attendees.filter(c=>this.agendaRequestForms[index].selectedExcludeUsers.findIndex(a=>a.id === c.id) === -1)
        .filter(c=>this.agendaRequestForms[index].selectedPresenters.findIndex(a=>a.id === c.id) === -1)
        );
        this.agendaRequestForms[index].presenterId = null;
        this.updatePresenterForm(index,this.agendaRequestForms[index].selectedPresenters.map(c=>c.id));
    }
    updatePresenterForm(index: number, value: number[]): void{
        this.requests.controls[index].get('presenters').patchValue(value);
    }
    addExcludeUser(index: number): void{
        this.agendaRequestForms[index].presenterId = null;
        const existItem = this.agendaRequestForms[index].selectedExcludeUsers.find(c=>c.id === this.agendaRequestForms[index].excludeUserId);
        if(existItem == null){
            const objItem = this.agendaRequestForms[index].attendees.find(c=>c.id === this.agendaRequestForms[index].excludeUserId);
            if(objItem != null){
                this.agendaRequestForms[index].selectedExcludeUsers.push(objItem);
                this.agendaRequestForms[index].optionExcludeUsers.next(this.agendaRequestForms[index].attendees.filter(c=>this.agendaRequestForms[index].selectedExcludeUsers.findIndex(a=>a.id === c.id) === -1)
                .filter(c=>this.agendaRequestForms[index].selectedPresenters.findIndex(a=>a.id === c.id) === -1)
                );
                this.agendaRequestForms[index].optionPresenters.next(this.allUsers.filter(c=>this.agendaRequestForms[index].selectedPresenters.findIndex(a=>a.id === c.id) === -1)
                .filter(c=>this.agendaRequestForms[index].selectedExcludeUsers.findIndex(a=>a.id === c.id) === -1)
                );

                this.agendaRequestForms[index].excludeUserId = null;
                this.updateExcludeUserForm(index,this.agendaRequestForms[index].selectedExcludeUsers.map(c=>c.id));
            }
        }
    }
    removeExcludeUser(index: number , value: UserModel): void{
        this.agendaRequestForms[index].presenterId = null;
        this.agendaRequestForms[index].selectedExcludeUsers = this.agendaRequestForms[index].selectedExcludeUsers.filter(c=>c.id !== value.id);
        this.agendaRequestForms[index].optionExcludeUsers.next(this.agendaRequestForms[index].attendees.filter(c=>this.agendaRequestForms[index].selectedExcludeUsers.findIndex(a=>a.id === c.id) === -1)
        .filter(c=>this.agendaRequestForms[index].selectedPresenters.findIndex(a=>a.id === c.id) === -1)
        );
        this.agendaRequestForms[index].optionPresenters.next(this.allUsers.filter(c=>this.agendaRequestForms[index].selectedPresenters.findIndex(a=>a.id === c.id) === -1)
                .filter(c=>this.agendaRequestForms[index].selectedExcludeUsers.findIndex(a=>a.id === c.id) === -1)
                );
        this.agendaRequestForms[index].excludeUserId = null;
        this.updateExcludeUserForm(index,this.agendaRequestForms[index].selectedExcludeUsers.map(c=>c.id));
    }
    updateExcludeUserForm(index: number, value: number[]): void{
        this.requests.controls[index].get('excludeUsers').patchValue(value);
    }

    saveData(): void {
        if (this.action === 'add') {
            this.create();
        } else {
            this.update();
        }
    }
    create(): void {
        if (this.dataForm.valid) {
            const rowData = this.dataForm.getRawValue();
            const postDatas = rowData.requests;
            postDatas.forEach((item)=>{
                if(item.useTime == null){
                    item.useTime = 0;
                }
            });
            // postDatas = postDatas.map(c=>new AgendaRequestFormModel(c));
            Swal.fire({
                title: '',
                text: 'Do you want to save?',
                showCancelButton: true,
                confirmButtonText: 'Save',
                cancelButtonText: 'Cancel',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.dataForm.disable();
                    this._service.create(postDatas).subscribe({
                        next: (resp: any) => {
                            Swal.fire(
                                '',
                                'Data has been saved.'
                            ).then(() => {
                                this._matDialogRef.close(resp);
                            });
                        },
                        error: () => {
                            this.dataForm.enable();
                        },
                    });
                }
            });
        }
    }
    update(): void {
        // if (this.dataForm.valid) {
        //     const postData = new AgendaReserveModel(
        //         this.dataForm.getRawValue()
        //     );
        //     Swal.fire({
        //         title: 'Confirm ?',
        //         text: 'Save Confirmation!',
        //         icon: 'warning',
        //         showCancelButton: true,
        //         confirmButtonText: 'Confirm',
        //         cancelButtonText: 'Cancel',
        //     }).then((result) => {
        //         if (result.isConfirmed) {
        //             this.dataForm.disable();
        //             this._service.update(postData).subscribe({
        //                 next: (resp: AgendaReserveModel) => {
        //                     Swal.fire(
        //                         'Success',
        //                         'Data has been saved.',
        //                         'success'
        //                     ).then(() => {
        //                         this._matDialogRef.close(resp);
        //                     });
        //                 },
        //                 error: () => {
        //                     this.dataForm.enable();
        //                 },
        //             });
        //         }
        //     });
        // }
    }
    close(): void {
        this._matDialogRef.close();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    ngAfterContentChecked(): void {}
}
