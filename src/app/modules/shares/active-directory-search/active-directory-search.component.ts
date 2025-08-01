import { DataListModel } from './../../../models/data-list.model';
import {Component,OnInit,ViewEncapsulation,OnDestroy, ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { Subject, Observable, takeUntil, take } from 'rxjs';
import { LdapOptionModel } from 'app/models/ldap-option.model';
import { LdapDataModel } from 'app/models/ldap-data.model';
import { LdapSearchInputModel } from 'app/models/ldap-search-input.model';
import { ActiveDirectorySearchService } from './active-directory-search.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';


@Component({
    selector: 'active-directory-search',
    templateUrl: './active-directory-search.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ActiveDirectorySearchComponent implements OnInit, OnDestroy{
    listData$: Observable<LdapDataModel[]>;
    searchQuery: LdapSearchInputModel = new LdapSearchInputModel({});
    kw: string;
    isLoading: boolean = false;
    ldapOption$: Observable<LdapOptionModel[]>;
    private _unsubscribeAll: Subject<any> = new Subject();
    constructor(
        private _matDialogRef: MatDialogRef<ActiveDirectorySearchComponent>,
        private _service: ActiveDirectorySearchService,
        private _splash: FuseSplashScreenService,
    ) { }

    ngOnInit(): void {
        this.ldapOption$ = this._service.ldapOption$;
        this.listData$ = this._service.listData$;
        setTimeout(() => {
            this._service.getOptions().pipe(takeUntil(this._unsubscribeAll)).subscribe();
        }, 0);
    }
    loadData(): void {
        this._splash.show();
        this._service.getDatas(this.searchQuery).pipe(take(1)).subscribe(()=>{
            this._splash.hide();
        });
    }
    doSearch(): void {
        this.loadData();
    }
    doSelect(selectData: LdapDataModel): void {
        this._service.clearData();
        this.ldapOption$.pipe(take(1)).subscribe((value)=>{
            selectData.ldapId = this.searchQuery.ldapId;
            selectData.prefixDomain = value.find(c=>c.id === selectData.ldapId).prefixDomain;
            this.close(selectData);
        });
    }
    clearSearch(): void{
        this.searchQuery.kw = null;
        this.searchQuery.ldapId = null;
        this.searchQuery.searchType = null;
        this.loadData();
    }
    close(popData: LdapDataModel): void {
        this._service.clearData();
        this._matDialogRef.close(popData);
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
