/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { FuseSplashScreenService } from '@fuse/services/splash-screen/splash-screen.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DataListModel } from 'app/models/data-list.model';
import { SuccessModel } from 'app/models/success.model';
import { encryptStorage } from 'app/constants/constant';

@Injectable()
export class ConnectionService {
    constructor(
        private http: HttpClient,
        private fuseSplashScreen: FuseSplashScreenService,
        private _matDialog: MatDialog,
        private _router: Router
    ) {}

    noTokenPost(
        url: string,
        data: any,
        responseClass: any,
        splash: boolean = true
    ): Promise<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            }),
        };
        return new Promise((resolve, reject) => {
            if (splash) {
                this.fuseSplashScreen.show();
            }
            this.http
                .post(`${environment.apiUrl}${url}`, data, httpOptions)
                .subscribe(
                    (response: any) => {
                        this.fuseSplashScreen.hide();
                        if (response == null) {
                            resolve(null);
                        } else {
                            resolve(new responseClass(response));
                        }
                        resolve(response);
                    },
                    (error) => {
                        if (splash) {
                            this.fuseSplashScreen.hide();
                        }
                        this.handleError(error);

                        reject(error);
                    }
                );
        });
    }

    // azureLoginPost(
    //     url: string,
    //     data: any,
    //     responseClass: any,
    //     splash: boolean = true
    // ): Promise<any> {
    //     const httpOptions = {
    //         headers: new HttpHeaders({
    //             'Content-Type': 'application/json',
    //             'Cache-Control': 'no-cache',
    //         }),
    //     };
    //     return new Promise((resolve, reject) => {
    //         if (splash) {
    //             this.fuseSplashScreen.show();
    //         }
    //         this.http
    //             .post(`${environment.apiUrl}${url}`, data, httpOptions)
    //             .subscribe(
    //                 (response: any) => {
    //                     this.fuseSplashScreen.hide();
    //                     if (response == null) {
    //                         resolve(null);
    //                     } else {
    //                         resolve(new responseClass(response));
    //                     }
    //                     resolve(response);
    //                 },
    //                 (error) => {
    //                     if (splash) {
    //                         this.fuseSplashScreen.hide();
    //                     }
    //                     if (error.status === 400) {
    //                         Swal.fire({
    //                             title: '',
    //                             text: 'คุณไม่มีสิทธิ์เข้าใช้งานระบบหรือเข้าสู่ระบบด้วย user อื่นอยู่กรุณา Logout และ Login ด้วย User ที่มีสิทธิใช้งาน',

    //                             showCancelButton: false,
    //                             confirmButtonText: 'OK',

    //                         }).then(() => {
    //                             this._azureService.logoutRedirect();
    //                         });
    //                     } else {
    //                         this.handleError(error);
    //                     }

    //                     reject(error);
    //                 }
    //             );
    //     });
    // }

    post(
        url: string,
        data: any,
        responseClass: any,
        splash: boolean = true
    ): Promise<any> {
        // eslint-disable-next-line no-var
        var token = encryptStorage.getItem('token')
            ? encryptStorage.getItem('token')
            : '1234';
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Authorization': 'Bearer ' + token,
            }),
        };
        return new Promise((resolve, reject) => {
            if (!token) {
                this._router.navigate(['login']);
                resolve(null);
                return;
            }
            if (splash) {
                this.fuseSplashScreen.show();
            }
            this.http
                .post(`${environment.apiUrl}${url}`, data, httpOptions)
                .subscribe(
                    (response: any) => {
                        this.fuseSplashScreen.hide();
                        if (response == null) {
                            resolve(null);
                        } else {
                            if (responseClass == null) {
                                resolve(response);
                            } else {
                                if (Array.isArray(response)) {
                                    resolve(
                                        response.map(
                                            (c: any) => new responseClass(c)
                                        )
                                    );
                                } else {
                                    resolve(new responseClass(response));
                                }
                            }
                        }
                    },
                    (error) => {
                        if (splash) {
                            this.fuseSplashScreen.hide();
                        }
                        this.handleError(error);

                        reject(error);
                    }
                );
        });
    }

    handleError(error: any) {
        if (error.status === 400) {
            let errorMessage = '';
            if (error.error) {
                errorMessage = error.error;
            } else {
                errorMessage = 'Api Error 400';
            }

            Swal.fire({
                title: '',
                text: errorMessage,
                showCancelButton: false,
                confirmButtonText: 'OK',
            });
        } else if (error.status === 500) {
            Swal.fire({
                title: '',
                text: 'API Error',
                showCancelButton: false,
                confirmButtonText: 'OK',
            });
        } else if (error.status === 404) {
            Swal.fire({
                title: '',
                text: 'API Not Found',
                showCancelButton: false,
                confirmButtonText: 'OK',
            });
        } else if (error.status === 401 || error.status === 403) {
            encryptStorage.removeItem('token');
            Swal.fire({
                title: '',
                text: 'Autentication Fail please login again',
                showCancelButton: false,
                confirmButtonText: 'OK',
            }).then(() => {
                this._router.navigateByUrl('/sign-out');
            });
        } else {
            Swal.fire({
                title: '',
                text: 'API Error',
                showCancelButton: false,
                confirmButtonText: 'OK',
            });
        }
    }
    get(url: string, splash: boolean = true) {
        const token = encryptStorage.getItem('token');
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'token': token ? token : '',
            }),
        };
        return new Promise((resolve, reject) => {
            if (splash) {
                this.fuseSplashScreen.show();
            }
            this.http.get(`${environment.apiUrl}${url}`, httpOptions).subscribe(
                (response: any) => {
                    this.fuseSplashScreen.hide();
                    resolve(response);
                },
                (error) => {
                    console.log(error);
                    this.fuseSplashScreen.hide();
                    reject(error);
                }
            );
        });
    }
}
