import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-new-object-dialog',
  templateUrl: './new-object-dialog.component.html',
  styleUrls: ['./new-object-dialog.component.css']
})
export class NewObjectDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<NewObjectDialogComponent>) { }

  ngOnInit() {
  }

  addUserDetail(objectInfo){
    this.dialogRef.close(objectInfo);
  }


}
