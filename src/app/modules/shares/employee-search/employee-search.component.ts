import { EmployeeSearchService } from './employee-search.service';
import { QueryListModel } from './../../../models/query-list.model';
import { DataListModel } from './../../../models/data-list.model';
import {
    Component,
    OnInit,
    ViewEncapsulation,
    Inject,
    OnDestroy,
    ViewChild,
} from '@angular/core';
import { UntypedFormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ENDPOINT } from 'app/constants/endpoint';
import { EmployeeModel } from 'app/models/employee.model';
import { InputFormData } from 'app/models/input-form-data';
import { StandardModel } from 'app/models/standard.model';
import { Subject, Observable, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { LdapOptionModel } from 'app/models/ldap-option.model';
import { LdapDataModel } from 'app/models/ldap-data.model';
import { LdapSearchInputModel } from 'app/models/ldap-search-input.model';

@Component({
    selector: 'app-employee-search',
    templateUrl: './employee-search.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class EmployeeSearchComponent implements OnInit, OnDestroy {
    listData$: Observable<DataListModel<LdapDataModel>>;
    searchQuery: LdapSearchInputModel = new LdapSearchInputModel({});
    kw: string;
    isLoading: boolean = false;
    ldapOption$: Observable<LdapOptionModel[]>;
    private _unsubscribeAll: Subject<any> = new Subject();
    constructor(
        private _matDialogRef: MatDialogRef<EmployeeSearchComponent>,
        private _formBuilder: UntypedFormBuilder,
        private _service: EmployeeSearchService
    ) {}

    ngOnInit(): void {
        this.ldapOption$ = this._service.ldapOption$;
        this.listData$ = this._service.listData$;
        this._service.getOptions().pipe(takeUntil(this._unsubscribeAll)).subscribe();
    }
    loadData(): void {
        this._service.getDatas(this.searchQuery).pipe(takeUntil(this._unsubscribeAll)).subscribe();
        this.listData$ = this._service.listData$;
    }
    doSearch(): void {
        this.loadData();
    }
    doSelect(selectData: LdapDataModel): void{
        this.close(selectData);
    }
    close(popData: LdapDataModel): void {
        this._matDialogRef.close(popData);
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
