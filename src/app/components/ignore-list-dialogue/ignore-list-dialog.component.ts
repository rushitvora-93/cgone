import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-ignore-list-dialog',
  templateUrl: './ignore-list-dialog.component.html',
  styleUrls: ['./ignore-list-dialog.component.css']
})
export class IgnoreListDialogComponent implements OnInit {

  checked=false;
  constructor(public dialogRef: MatDialogRef<IgnoreListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {}

  

  saveList(){
    this.dialogRef.close('save');
  }

  
  cancelIgnoreList(){
    this.dialogRef.close('cancel');
  }
}
