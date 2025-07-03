import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { ENDPOINT } from 'app/constants/endpoint';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    private _navigation: ReplaySubject<FuseNavigationItem[]> = new ReplaySubject<FuseNavigationItem[]>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<FuseNavigationItem[]> {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<FuseNavigationItem[]> {
        return this._httpClient.get<FuseNavigationItem[]>(ENDPOINT.common.getMenu).pipe(
            tap((navigation) => {
                this._navigation.next(navigation);
            })
        );
    }
}
