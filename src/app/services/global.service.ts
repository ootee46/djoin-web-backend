import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { encryptStorage } from 'app/constants/constant';
import { PackageInfoModel } from 'app/models/package-info.model';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class GlobalService
{
    packageInfo: PackageInfoModel = new PackageInfoModel({});
    constructor(private _httpClient: HttpClient, private _router: Router)
    {
    }
    get accessToken(): string {
        return encryptStorage.getItem('accessToken') ?? '';
    }
    set accessToken(token: string) {
        encryptStorage.setItem('accessToken', token);
    }
    public getHttpHeader(): any{
        return  {
            /* eslint-disable @typescript-eslint/naming-convention */
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Authorization': 'Bearer ' + this.accessToken
            })
        };
    }
    handleError(error: any): void {
        console.log(error);
        if (error.status === 400) {
            let errorMessage = '';
            if (error.error && typeof (error.error) == 'string') {
                errorMessage = error.error;
            }
            else {
                errorMessage = 'Api Error 400';
            }
            Swal.fire({
                title: '',
                text: errorMessage,
                showCancelButton: false,
                confirmButtonText: 'OK'
            });
        }
        else if (error.status === 500) {
            Swal.fire({
                title: '',
                text: 'API Error',
                showCancelButton: false,
                confirmButtonText: 'OK'
            });
        }
        else if (error.status === 404) {
            Swal.fire({
                title: '',
                text: 'API Not Found',
                showCancelButton: false,
                confirmButtonText: 'OK'
            });
        }
        else if (error.status === 401 || error.status === 403) {
            encryptStorage.clear();
            Swal.fire({
                title: '',
                text: 'Autentication Fail please login again',
                showCancelButton: false,
                confirmButtonText: 'OK'
            }).then(() => {
                this._router.navigateByUrl('/logout');
            });
        }
        else {
            Swal.fire({
                title: '',
                text: 'API Error',
                showCancelButton: false,
                confirmButtonText: 'OK'
            });
        }
    }
}
