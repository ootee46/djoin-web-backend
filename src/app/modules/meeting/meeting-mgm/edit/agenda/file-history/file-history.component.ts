import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AttachmentHistoryModel } from 'app/models/attachment-history.model';
import { InputFormData } from 'app/models/input-form-data';

@Component({
  selector: 'app-file-history',
  templateUrl: './file-history.component.html'
})
export class FileHistoryComponent implements OnInit {
  itemCount: number[] = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
  datas: AttachmentHistoryModel[] = [];
  constructor(
    private _matDialogRef: MatDialogRef<FileHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) private input: AttachmentHistoryModel[],
  ) { }

  ngOnInit(): void {
    this.datas = this.input;
  }

  close(): void{
    this._matDialogRef.close();
  }

}
