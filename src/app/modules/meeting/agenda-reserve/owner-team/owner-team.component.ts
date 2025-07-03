import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgendaRequestItemModel, AgendaRequestTeamFormModel } from 'app/models/agenda-request.model';
import { MemberUserModel } from 'app/models/member-user.model';
import { UserModel } from 'app/models/user.model';
import { BehaviorSubject, Observable, Subject, take, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { AgendaReserveService } from '../agenda-reserve.service';
import { OwnerTeamService } from './owner-team.service';

@Component({
    selector: 'app-owner-team',
    templateUrl: './owner-team.component.html'
})
export class OwnerTeamComponent implements OnInit, OnDestroy {
    @Input() data$: Observable<AgendaRequestItemModel>;
    @Input() users$: Observable<UserModel[]>;
    data: AgendaRequestItemModel = null;
    id: string;
    selectedTeam: number;
    selectedTeams: number[] = [];
    users: UserModel[] = [];
    private _optionUsers: BehaviorSubject<UserModel[] | null> = new BehaviorSubject([]);
    private _unsubscribeAll: Subject<any> = new Subject();
    constructor(
        private _service: OwnerTeamService,
        private _agendaReserveService: AgendaReserveService,
        private _route: ActivatedRoute
    ) {

    }
    get optionUsers$(): Observable<UserModel[]> {
        return this._optionUsers.asObservable();
    }


    ngOnInit(): void {
        this.id = this._route.snapshot.paramMap.get('id');
        this.data$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value)=>{
            if(value &&  value.teams && Array.isArray(value.teams) && value.teams.length > 0){
                this.selectedTeams = value.teams.map(c=>c.id);
            }else{
                this.selectedTeams = [];
            }
        });
        this.users$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value)=>{
            if(value){
                this.users = value;
                this.reloadUser();
            }
        });
    }

    reloadUser(): void{
        this._optionUsers.next(this.users.filter(c =>  !this.selectedTeams.find(a => a === c.id)));
    }

    addTeam(id: number): void {
        if (this.selectedTeam) {
            const obj = new AgendaRequestTeamFormModel({});
            obj.id = id;
            obj.userId = this.selectedTeam;
            this._service.add(obj).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
                this._agendaReserveService.getData(this.id)
                    .pipe(take(1)).subscribe(()=>{
                        this.selectedTeam = null;
                        this.reloadUser();
                    });
            });
        }
    }

    removeTeam(id: number, userId: number): void{
        Swal.fire({
            title: '',
            text: 'Do you want to delete this item?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if(result.isConfirmed){
                const obj = new AgendaRequestTeamFormModel({});
                obj.id = id;
                obj.userId = userId;
                this._service.delete(obj).subscribe({
                    next: ()=>{
                        Swal.fire('','Record Deleted!').then(()=>{
                            this._agendaReserveService.getData(this.id).pipe(take(1)).subscribe(()=>{
                                this.selectedTeam = null;
                                this.reloadUser();
                            });
                         });
                    }
                });
            }
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
