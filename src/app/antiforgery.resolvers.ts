import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { AuthService } from './core/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AntiforgerResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Use this resolver to resolve initial mock-api for the application
     *
     * @param route
     * @param state
     */
    resolve(): Observable<any>
    {
        // Fork join multiple API endpoint calls to wait all of them to finish
        return forkJoin([
          this._authService.getAntiforgery()
        ]);
    }
}
