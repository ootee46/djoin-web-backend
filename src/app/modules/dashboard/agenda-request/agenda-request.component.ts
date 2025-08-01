import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AgendaRequestItemListModel, AgendaRequestItemModel, AgendaRequestModel } from 'app/models/agenda-request.model';
import { DataListModel } from 'app/models/data-list.model';
import { QueryListModel } from 'app/models/query-list.model';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { AgendaReserveService } from 'app/modules/meeting/agenda-reserve/agenda-reserve.service';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'dashboard-agenda-request',
  templateUrl: './agenda-request.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class DashboardAgendaRequestComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  @ViewChild('scrollTable', { static: false }) scroll: ElementRef;
  listData$: Observable<DataListModel<AgendaRequestModel>>;
  isLoading: boolean = false;
  isAdvance: boolean = false;
  searchQuery: QueryListModel = new QueryListModel({});
  private _unsubscribeAll: Subject<any> = new Subject();
  private _isPageLoad: boolean = false;
  constructor(
    private _service: DashboardService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _requestService: AgendaReserveService,
  ) {

  }

  ngOnInit(): void {
    this.listData$ = this._service.agendaRequests$;
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

  viewDetal(rowData: AgendaRequestItemModel): void {
    this._router.navigate(['/meeting/agenda-reserve/detail', rowData.id], { relativeTo: this._activatedRoute });
  }
  deleteData(rowData: AgendaRequestItemListModel): void {
    Swal.fire({
      title: '',
      text: 'Do you want to delete this item?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this._requestService.delete(rowData.id).subscribe({
          next: () => {
            this._service.getPackageInfo().pipe(take(1)).subscribe();
            Swal.fire('', 'Data has been deleted.').then(() => { this.loadData(); });
          }
        });
      }
    });
  }
  loadData(): void {
    this.searchQuery.pageSize = (this.paginator ? this.paginator.pageSize : this.searchQuery.pageSize);
    this._service.getAgendaRequest(this.searchQuery).pipe(take(1)).subscribe(() => {
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

  doSearch(): void {}

  clearSearch(): void {
      this.searchQuery.page = 0;
      this.searchQuery.kw = null;
      this.loadData();
  }

  toggleAdvanceSearch(): void {
      this.isAdvance = !this.isAdvance;
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
