/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, Subject, takeUntil, takeWhile, tap, timer } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from 'environments/environment';
import { encryptStorage } from 'app/constants/constant';

@Component({
    selector: 'auth-sign-out',
    templateUrl: './sign-out.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class AuthSignOutComponent implements OnInit, OnDestroy {
    signoutUrl: string = '';
    countdown: number = 5;
    countdownMapping: any = {
        '=1': '# second',
        other: '# seconds',
    };
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(private _authService: AuthService, private _router: Router) {
        this.signoutUrl = environment.baseHref;
        if (!environment.isLocal) {
            let raw = encryptStorage.getItem('logoutUrl'); // tainted
            if (raw && this.isSafeUrl(raw)) {
                this.signoutUrl = this.signoutUrl + '/../' + raw;
            }
            else{
                this.signoutUrl = this.signoutUrl + '/../home';
            }
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Sign out
        this._authService.signOut();

        // Redirect after the countdown
        timer(1000, 1000)
            .pipe(
                finalize(() => {
                    window.location.assign(this.signoutUrl);
                }),
                takeWhile(() => this.countdown > 0),
                takeUntil(this._unsubscribeAll),
                tap(() => this.countdown--)
            )
            .subscribe();
    }

    private isSafeUrl(raw?: string | null): URL | null {
        if (!raw) return null;

        try {
            // ตีความเป็น URL โดยมี base เป็น origin ปัจจุบัน
            const url = new URL(raw, window.location.origin);

            // 1) อนุญาตเฉพาะ http/https
            if (url.protocol !== 'https:' && url.protocol !== 'http:')
                return null;

            // 2) กัน open-redirect:
            //    - ถ้าเป็น same-origin => โอเค
            //    - ถ้าเป็น external ต้องอยู่ใน allowlist ข้างบนเท่านั้น
            const sameOrigin =
                url.origin === window.location.origin ||
                (url.hostname === window.location.hostname &&
                    url.port === window.location.port);

            if (!sameOrigin) {
                return null; // ไม่อนุญาตให้ redirect ไปที่อื่น
            }

            // 3) กัน protocol-relative ('//evil.com') ได้แล้วเพราะเช็ค host + protocol ด้านบน
            return url;
        } catch {
            // ถ้า parse ไม่ได้ก็ถือว่าไม่ปลอดภัย
            return null;
        }
    }

    goHomePage(): void {
        window.location.href = this.signoutUrl;
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
