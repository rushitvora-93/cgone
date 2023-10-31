import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-setup-new-env-dialog',
  templateUrl: './setup-new-env-dialog.component.html',
  styleUrls: ['./setup-new-env-dialog.component.css']
})
export class SetupNewEnvDialogComponent implements OnInit {

  checked=false;
  env:any={}
  constructor(public dialogRef: MatDialogRef<SetupNewEnvDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {}

  

  saveEnv(form){
    this.env.id=0;
    this.dialogRef.close(this.env);
  }

  
  cancelIgnoreList(){
    this.dialogRef.close('cancel');
  }

  
}
