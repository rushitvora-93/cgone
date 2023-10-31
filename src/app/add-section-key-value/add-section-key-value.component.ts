import { Component, OnInit ,Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
@Component({
  selector: 'app-add-section-key-value',
  templateUrl: './add-section-key-value.component.html',
  styleUrls: ['./add-section-key-value.component.css']
})
export class AddSectionKeyValueComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddSectionKeyValueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }
  configOptions = {
    name : '',
    value : ''
  }

  close() {
     this.dialogRef.close(this.configOptions);
  }
  

}
