import { Component, OnInit ,Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-remove-environment-dialog',
  templateUrl: './remove-environment-dialog.component.html',
  styleUrls: ['./remove-environment-dialog.component.css']
})
export class RemoveEnvironmentDialogComponent implements OnInit {
  
  constructor(public dialogRef: MatDialogRef<RemoveEnvironmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) {
    
  }


  ngOnInit() {
  }

  removeEnvironment(){
    this.dialogRef.close('save');
  }

}
