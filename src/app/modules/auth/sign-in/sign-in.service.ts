import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { ENDPOINT } from 'app/constants/endpoint';
import { CustomerModel } from 'app/models/customer.model';

@Injectable({
    providedIn: 'root'
})
export class SigninService {
    private _customers: BehaviorSubject<CustomerModel[] | null> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient) {
    }
    get customers$(): Observable<CustomerModel[]> {
        return this._customers.asObservable();
    }

    getCustomer(): Observable<CustomerModel[]> {
        return this._httpClient.post<CustomerModel[]>(ENDPOINT.noAuth.getCustomer,null).pipe(
            tap((response: any) => {
                this._customers.next(response.map(c => new CustomerModel(c)));
            })
        );
    }
}
