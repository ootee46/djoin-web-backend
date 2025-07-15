import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    catchError,
    Observable,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { ENDPOINT } from 'app/constants/endpoint';
import { encryptStorage } from 'app/constants/constant';

@Injectable()
export class AuthService {
    public antiforgery: string = null;
    private _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get accessToken(): string {
        const tmpToken = encryptStorage.getItem('accessToken');
        if (
            tmpToken === null ||
            tmpToken === 'null' ||
            tmpToken === undefined ||
            tmpToken === 'undefined'
        ) {
            encryptStorage.removeItem('accessToken');
            return null;
        } else {
            return tmpToken;
        }
    }

    set accessToken(token: string) {
        if (
            token === null ||
            token === 'null' ||
            token === undefined ||
            token === 'undefined'
        ) {
            encryptStorage.removeItem('accessToken');
        } else {
            encryptStorage.setItem('accessToken', token);
        }
    }

    getAntiforgery(): Observable<any> {
        return this._httpClient.get<any>(ENDPOINT.service.getAntiforgery).pipe(
            tap((response) => {
                if (typeof response == 'object' && response.token) {
                    this.antiforgery = response.token;
                }
            })
        );
    }

    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    signIn(credentials: {
        userName: string;
        password: string;
        siteId: number;
    }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post(ENDPOINT.auth.login, credentials).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage
                this.accessToken = response.token;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    signInUsingToken(): Observable<any> {
        // Renew token
        return this.getAntiforgery().pipe(
            catchError(() => of(false)),
            switchMap(() =>
                this._httpClient.post(ENDPOINT.auth.refreshToken, null).pipe(
                    catchError(() => of(false)),
                    switchMap((response: any) => {
                        // Store the access token in the local storage
                        this.accessToken = response.token;

                        // Set the authenticated flag to true
                        this._authenticated = true;

                        // Store the user on the user service
                        this._userService.user = response.user;

                        // Return true
                        return of(true);
                    })
                )
            )
        );
    }

    signOut(): Observable<any> {
        // Remove the access token from the local storage

        // Return the observable
        this._httpClient
            .post(ENDPOINT.auth.logout, {})
            .pipe(take(1))
            .subscribe(() => {
                encryptStorage.removeItem('accessToken');

                // Set the authenticated flag to false
                this._authenticated = false;
            });
        return of(true);
    }

    signUp(user: {
        name: string;
        email: string;
        password: string;
        company: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (
            !this.accessToken ||
            this.accessToken === undefined ||
            this.accessToken === 'undefined'
        ) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
