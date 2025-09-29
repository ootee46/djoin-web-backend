import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { environment } from 'environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private _baseHref: string = '';
    /**
     * Constructor
     */
    constructor(
        private readonly _authService: AuthService,
        private readonly _fuseSplashScreen: FuseSplashScreenService,
        private readonly _router: Router
    ) {}

    /**
     * Intercept
     *
     * @param req
     * @param next
     */
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        this._baseHref = environment.baseHref;
        //this._baseHref = this._platformLocation.getBaseHrefFromDOM();
        // Request
        //
        // If the access token didn't expire, add the Authorization header.
        // We won't add the Authorization header if the access token expired.
        // This will force the server to return a "401 Unauthorized" response
        // for the protected API routes which our response interceptor will
        // catch and delete the access token from the local storage while logging
        // the user out from the app.
        let newReq: HttpRequest<any>;
        if (
            this._authService.accessToken &&
            this._authService.accessToken !== undefined &&
            this._authService.accessToken !== 'undefined' &&
            !AuthUtils.isTokenExpired(this._authService.accessToken)
        ) {
            newReq = req.clone({
                headers: req.headers
                    .set(
                        'Authorization',
                        'Bearer ' + this._authService.accessToken
                    ),
                withCredentials: true,
            });
        } else {
            newReq = req.clone({
                withCredentials: true,
            });
            this._authService.accessToken = null;
        }

        // Response
        return next.handle(newReq).pipe(
            catchError((error) => {
                const bypassHandle = ['/auth/azure-login'];
                const bypassHandle2 = ['/auth/login'];
                if (
                    error.url.includes(bypassHandle) ||
                    error.url.includes(bypassHandle2)
                ) {
                    return throwError(() => error);
                }
                this._fuseSplashScreen.hide();
                if (
                    error instanceof HttpErrorResponse &&
                    error.status === 404
                ) {
                    Swal.fire('', 'Page not found', 'error').then(() => {
                        // Sign out
                        // this._authService.signOut();

                        // Reload the app
                        //location.reload();
                        this._router.navigate(['/dashboard']);
                    });
                } else if (
                    error instanceof HttpErrorResponse &&
                    error.status === 400
                ) {
                    let errorMessage = 'Validation error';
                    if (error.error && error.error.messages) {
                        if (Array.isArray(error.error.messages)) {
                            errorMessage = error.error.messages.join('<br>');
                        } else {
                            errorMessage = error.error.messages;
                        }
                    }
                    Swal.fire('', errorMessage);
                } else if (
                    error instanceof HttpErrorResponse &&
                    (error.status === 401 || error.status == 403)
                ) {
                    Swal.fire('', "You don't have permission ", 'error').then(
                        () => {
                            // Sign out
                            // this._authService.signOut();

                            // Reload the app
                            //location.reload();
                            window.location.href = `${this._baseHref}../`;
                        }
                    );
                } else {
                    Swal.fire('', 'API error Code ' + error.status);
                }

                return throwError(() => error);
            })
        );
    }
}
