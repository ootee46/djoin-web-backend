import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class PrintService {
    isPrinting = false;

    constructor(private router: Router) { }

    printDocument(documentCategory: string, documentName: string, inputData: any): void {
        this.isPrinting = true;
        this.router.navigate(['/',
            {
                outlets: {
                    'print': ['print',documentCategory, documentName]
                }
            }],{ state: inputData, skipLocationChange: false });
    }

    onDataReady(): void {
        setTimeout(() => {
           window.print();
            this.isPrinting = false;
          this.router.navigate([{ outlets: { print: null } }]);
        });
    }
}
