import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { MeetingAttendeeFormModel, MeetingAttendeeModel } from 'app/models/attendee.model';
import { MemberGroupModel } from 'app/models/member-group.model';
import { QueryListModel } from 'app/models/query-list.model';
import { StandardModel } from 'app/models/standard.model';
import { UserModel } from 'app/models/user.model';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

import { MeetingMgmService } from '../../meeting-mgm.service';
import { AgendaService } from '../agenda/agenda.service';
import { AttendeeService } from './attendee.service';

@Component({
  selector: 'meeting-attendee',
  templateUrl: './attendee.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AttendeeComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('scrollTable', { static: false }) scroll: ElementRef;
    datas: MeetingAttendeeModel[] = [];
    users$: Observable<UserModel[]>;
    listData$: Observable<MeetingAttendeeModel[]>;
    memberGroups$: Observable<MemberGroupModel[]>;
    userGroups$: Observable<StandardModel[]>;
    isLoading: boolean = false;
    searchQuery: QueryListModel = new QueryListModel({});
    id: string;
    meetingId: number;
    groupId: number;
    userId: number;
    private _unsubscribeAll: Subject<any> = new Subject();
    constructor(
        private _service: AttendeeService,
        private _meetingService: MeetingMgmService,
        private _agendaService: AgendaService,
        private _route: ActivatedRoute,
        private _spalsh: FuseSplashScreenService,
    ) { }

    ngOnInit(): void {
        this.id = this._route.snapshot.paramMap.get('id');
        if(this.id){
            this.meetingId = parseInt(this.id,10);
            this.listData$ = this._service.datas$;
            this.users$ = this._service.users$;
            this.userGroups$ = this._service.userGroups$;
            this.initialData();
            this._service.userGroups$.subscribe((value)=>{});
        }
        // this._service.getDatas(this.searchQuery).pipe(takeUntil(this._unsubscribeAll)).subscribe((values)=>{
        //     if(values && Array.isArray(values) && values.length > 0){
        //         this.datas = values;
        //     }
        // });
        // this.adminUsers$ = this._service.adminUsers$;
        // this.memberGroups$ = this._service.memberGroups$;
        // this._service.getMemberGroup().pipe(takeUntil(this._unsubscribeAll)).subscribe();
        // this._service.getAdminUser().pipe(takeUntil(this._unsubscribeAll)).subscribe();
        // this.memberGroups$.subscribe((value)=>{
        //     console.log(value);
        // });
    }

    addUser(): void{
        if(this.userId){
            const postData = new MeetingAttendeeFormModel({});
            postData.typeId = 1;
            postData.id = this.userId;
            postData.meetingId = parseInt(this.id,10);
            this._spalsh.show();
            this._service.create(postData).pipe(takeUntil(this._unsubscribeAll)).subscribe(()=>{
                this.initialData();
                this.userId = null;
            });
        }
        else if(!this.userId && this.groupId){

            const postData = new MeetingAttendeeFormModel({});
            postData.typeId = 2;
            postData.id = this.groupId;
            postData.meetingId = parseInt(this.id,10);
            this._service.create(postData).pipe(takeUntil(this._unsubscribeAll)).subscribe(()=>{
                this.initialData();
                this.userId = null;
                this.groupId = null;
            });
        }
    }

    initialData(): void{
        this._service.getDatas(this.id).pipe(take(1)).subscribe(()=>{
            this._service.getUser((this.groupId?this.groupId.toString(): null)).pipe(take(1)).subscribe(()=>{
                this._spalsh.hide();
            });
        });
        // this._service.getUserGroup().pipe(take(1)).subscribe();
        // this._meetingService.getAttendee(this.id).pipe(take(1)).subscribe();
        // const _query = new QueryListModel({});
        // _query.catId = this.meetingId;
        // this._agendaService.getDatas(_query).pipe(take(1)).subscribe();
    }
    ngAfterViewInit(): void {
    }
    // create(): void {
    //     const inputData: InputFormData<MeetingAttendeeModel> = new InputFormData<MeetingAttendeeModel>();
    //     inputData.data = new MeetingAttendeeModel({});
    //     inputData.action = 'add';
    //     this.openForm(inputData);
    // }
    // edit(rowData: MeetingAttendeeModel): void {
    //    this._router.navigate(['edit',rowData.id],{relativeTo:this._activateRoute});
    // }
    deleteData(rowData: MeetingAttendeeModel): void{
        Swal.fire({
            title: '',
            text: 'Do you want to delete this item?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if(result.isConfirmed){
                this._service.delete(rowData.id).subscribe({
                    next: ()=>{
                        Swal.fire('', 'Data has been deleted.').then(()=>{ this.initialData(); });
                    }
                });
            }
        });
    }
    loadData(): void {
      //  this._service.getDatas(this.searchQuery).subscribe();
    }
    clearSearch(): void {
        this.searchQuery.page = 0;
        this.searchQuery.kw = null;
        this.loadData();
    }
    // openForm(input: InputFormData<MeetingAttendeeModel>): void{
    //     this._formPopup = this._matDialog.open(AttendeeFormComponent, {
    //         panelClass: 'standard-dialog',
    //         width: '100%',
    //         data: input
    //     });
    //     this._formPopup.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((resp: any) => {
    //         this.loadData();
    //     });
    // }

    toggleChirman(event: MatSlideToggleChange ,id: number): void{
        if(event.checked){
            this._service.setChirman(id).pipe(takeUntil(this._unsubscribeAll)).subscribe(()=>{
                this._spalsh.show();
                this.initialData();
            });
        }else{
            this._service.removeChirman(id).pipe(takeUntil(this._unsubscribeAll)).subscribe(()=>{
                this._spalsh.show();
                this.initialData();
            });
        }
    }

    toggleSecretary(event: MatSlideToggleChange ,id: number): void{
        if(event.checked){
            this._service.setSecretary(id).pipe(takeUntil(this._unsubscribeAll)).subscribe(()=>{
                this.initialData();
            });
        }else{
            this._service.removeSecretary(id).pipe(takeUntil(this._unsubscribeAll)).subscribe(()=>{
                this.initialData();
            });
        }
    }

    getUser(value: number): void{
        this._service.getUser(value?.toString()).pipe(takeUntil(this._unsubscribeAll)).subscribe();
    }

    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
