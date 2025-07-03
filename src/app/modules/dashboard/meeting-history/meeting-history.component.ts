import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { DataListModel } from 'app/models/data-list.model';
import { MeetingListModel } from 'app/models/meeting.model';
import { QueryListModel } from 'app/models/query-list.model';
import { MeetingMgmService } from 'app/modules/meeting/meeting-mgm/meeting-mgm.service';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'dashboard-meeting-history',
  templateUrl: './meeting-history.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class DashboardMeetingHistoryComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  @ViewChild('scrollTable', { static: false }) scroll: ElementRef;
  listData$: Observable<DataListModel<MeetingListModel>>;
  isLoading: boolean = false;
  isAdvance: boolean = false;
  searchQuery: QueryListModel = new QueryListModel({});
  private _unsubscribeAll: Subject<any> = new Subject();
  private _isPageLoad: boolean = false;
  constructor(
    private _service: DashboardService,
    private _meetingService: MeetingMgmService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this.listData$ = this._service.historyMeetings$;
  }
  ngAfterViewInit(): void {
    if (this.paginator) {
      if (!this._isPageLoad) {
        this._isPageLoad = true;
        this.paginator.page.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
          this.searchQuery.page = (this.paginator ? this.paginator.pageIndex : 0);
          this.searchQuery.pageSize = (this.paginator ? this.paginator.pageSize : this.searchQuery.pageSize);
          this.loadData();
        });
      }
    }
  }
  loadData(): void {
    this.searchQuery.pageSize = (this.paginator ? this.paginator.pageSize : this.searchQuery.pageSize);
    this._service.getHistoryMeeting(this.searchQuery).pipe(take(1)).subscribe(() => {
      if (this.paginator) {
        if (!this._isPageLoad) {
          this._isPageLoad = true;
          this.paginator.page.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
            this.searchQuery.page = (this.paginator ? this.paginator.pageIndex : 0);
            this.searchQuery.pageSize = (this.paginator ? this.paginator.pageSize : this.searchQuery.pageSize);
            this.loadData();
          });
        }
      }
    });
  }
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
  edit(rowData: MeetingListModel): void {
    this._router.navigate(['/meeting/meeting-mgm/edit/overview', rowData.id]);
  }
  deleteData(rowData: MeetingListModel): void {
    Swal.fire({
      title: '',
      text: 'Do you want to delete this item?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this._meetingService.delete(rowData.id).subscribe({
          next: () => {
            this._service.getPackageInfo().pipe(take(1)).subscribe();
            Swal.fire('', 'Data has been deleted.').then(() => { this.loadData(); });
          }
        });
      }
    });
  }

  doSearch(): void {

  }

  clearSearch(): void {

  }

  toggleAdvanceSearch(): void {
    this.isAdvance = !this.isAdvance;
  }


  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
