import { Component, OnInit ,Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
@Component({
  selector: 'app-open-object-dialog',
  templateUrl: './open-object-dialog.component.html',
  styleUrls: ['./open-object-dialog.component.css']
})
export class OpenObjectDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<OpenObjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) {
  }

  ngOnInit() {
  }

}
