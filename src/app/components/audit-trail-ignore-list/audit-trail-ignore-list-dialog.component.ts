import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-audit-trail-ignore-list-dialog',
  templateUrl: './audit-trail-ignore-list-dialog.component.html',
  styleUrls: ['./audit-trail-ignore-list-dialog.component.css']
})
export class AudtiTrailIgnoreListDialogComponent implements OnInit {

  checked=false;
  constructor(public dialogRef: MatDialogRef<AudtiTrailIgnoreListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {}

  

  saveList(){
    this.dialogRef.close('save');
  }

  
  cancelIgnoreList(){
    this.dialogRef.close('cancel');
  }

  
}
