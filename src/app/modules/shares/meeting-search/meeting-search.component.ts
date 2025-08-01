import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DataListModel } from 'app/models/data-list.model';
import { MeetingListModel } from 'app/models/meeting.model';
import { QueryListModel } from 'app/models/query-list.model';
import { Observable, take } from 'rxjs';
import { MeetingSearchService } from './meeting-search.service';

@Component({
    selector: 'app-meeting-search',
    templateUrl: './meeting-search.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class MeetingSearchComponent implements OnInit {
    query: QueryListModel = new QueryListModel({});
    listData$: Observable<DataListModel<MeetingListModel>>;
    constructor(
        private _matDialogRef: MatDialogRef<MeetingSearchComponent>,
        private _service: MeetingSearchService
    ) { }

    ngOnInit(): void {
        this.query.pageSize = 999;
        this.listData$ = this._service.listData$;
        this._service.clearData();
    }

    loadData(): void{
        if(this.query.kw != null && this.query.kw.trim() !== ''){
            this._service.getDatas(this.query).pipe(take(1)).subscribe();
        }

    }
    doSearch(): void{
        window.scrollTo(0,0);
        this.query.page = 0;
        this.loadData();
    }
    clearSearch(): void{
        this.query.kw = null;
        this.query.page = 0;
    }
    selectData(item: MeetingListModel): void{
        this._matDialogRef.close(item);
    }
    close(): void {
        this._matDialogRef.close(null);
    }

}
