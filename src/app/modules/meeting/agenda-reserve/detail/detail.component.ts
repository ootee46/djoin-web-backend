import { AgendaRequestItemModel } from 'app/models/agenda-request.model';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { AgendaReserveService } from '../agenda-reserve.service';
import { UserModel } from 'app/models/user.model';
import { StandardModel } from 'app/models/standard.model';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html'
})
export class AgendaReserveDetailComponent implements OnInit, OnDestroy {
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'info';
    data$: Observable<AgendaRequestItemModel>;
    data: AgendaRequestItemModel = new AgendaRequestItemModel({});
    users$: Observable<UserModel[]>;
    documentTypes$: Observable<StandardModel[]>;
    private _unsubscribeAll: Subject<any> = new Subject();
    constructor(
        private _service: AgendaReserveService
    ) {

     }

    ngOnInit(): void {
        this.data$ = this._service.data$;
        this.users$ = this._service.users$;
        this.documentTypes$ = this._service.documentTypes$;
        this.data$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value)=>{
            if(value){
                this.data = value;
                this.initPanel();
            }
        });
    }
    initPanel(): void{
        this.panels = [
            {
                id: 'info',
                title: 'Request Info',
                description: ''
            },
            
        ];
        if( this.data.isReview === false){
            this.panels.push({
                id: 'team',
                title: 'Agenda Working Team' ,
                description: ''
            });
        }
        if(this.data.isReviewed || (this.data.isEdit && !this.data.isReview)){
            this.panels.push({
                id: 'upload-document',
                title: 'Upload Attachment',
                description: ''
            });
        }
    }
    getPanelInfo(id: string): any {
        return this.panels.find(panel => panel.id === id);
    }
    goToPanel(panel: string): void {
        this.selectedPanel = panel;
        if (this.drawerMode === 'over') {
            this.drawer.close();
        }
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
