import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { JoinResultModel } from 'app/models/join-result.model';
import { QueryListModel } from 'app/models/query-list.model';
import { Subject, take, takeUntil } from 'rxjs';
import { JoinResultService } from './join-result.service';
import { fuseAnimations } from '@fuse/animations';
import { MeetingAttendeeModel } from 'app/models/attendee.model';
import { ActivatedRoute } from '@angular/router';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';

import { Buffer } from 'buffer';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { PlatformLocation } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'join-result',
  templateUrl: './join-result.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class JoinResultComponent implements OnInit, OnDestroy {
    @ViewChild('scrollTable', { static: false }) scroll: ElementRef;
    datas: MeetingAttendeeModel[] = [];
    searchQuery: QueryListModel = new QueryListModel({});
    meetingId: number;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _query = new QueryListModel({});
    private _baseHref: string = '';
    constructor(
        private _service: JoinResultService,
        private _route: ActivatedRoute,
        private _platformLocation: PlatformLocation,
        private _http: HttpClient,
    ) { }

    ngOnInit(): void {
        this._baseHref = this._platformLocation.getBaseHrefFromDOM();
        this.meetingId = parseInt(this._route.snapshot.paramMap.get('id'), 10);
        if(this.meetingId){
            this._query.catId = this.meetingId;
            this._service.datas$.pipe(takeUntil(this._unsubscribeAll)).subscribe((values) => {
                if (values) {
                    this.datas = values;
                } else {
                    this.datas = [];
                }
            });
        }
    }

    export(): void{
        const wb = new ExcelJS.Workbook();
        const reader = new FileReader();
        this._http.get(this._baseHref + 'assets/templates/join-result.xlsx', { responseType: 'blob' }).pipe(take(1))
        .subscribe((excelTemplate) => {
            reader.readAsArrayBuffer(excelTemplate);
            reader.onload = (): void => {
                const buffer: ArrayBuffer = reader.result as ArrayBuffer;
                const excelData = new Uint8Array(buffer);
                wb.xlsx.load(Buffer.from(excelData)).then((workbook) => {
                    const worksheet = workbook.getWorksheet(1);
                    this.datas.forEach((item,index)=>{
                        worksheet.getCell('A' + (index + 2)).value = item.name;
                        worksheet.getCell('B' + (index + 2)).value = item.email;
                        worksheet.getCell('C' + (index + 2)).value = (item.isConfirm?'Yes':(item.isConfirm === false ? 'No' : 'N/A' ));
                        worksheet.getCell('D' + (index + 2)).value = (item.confirmDate? moment(item.confirmDate).format('DD/MM/YYYY HH:mm') :'');
                    });
                    workbook.xlsx.writeBuffer().then((data) => {
                        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                        FileSaver.saveAs(blob, 'join-result-' + moment().format('YYYY-MM-DD') + '.xlsx');
                    });
                });
            };
        });
    }
    loadData(): void {
        this._service.getDatas(this.meetingId).pipe(take(1)).subscribe();
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
