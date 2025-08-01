import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mail-server',
  templateUrl: './mail-server.component.html'
})
export class MailServerComponent implements OnInit {

    isLoading: boolean;
    constructor() {
      this.isLoading = false;
    }
    ngOnInit(): void {
    }

}
