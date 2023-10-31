import { Component, OnInit ,Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { AutomatorApiService } from '../services/automator-api.service';
@Component({
  selector: 'app-object-detail-dialog',
  templateUrl: './object-detail-dialog.component.html',
  styleUrls: ['./object-detail-dialog.component.css']
})
export class ObjectDetailDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ObjectDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private automatorApiService : AutomatorApiService
  ) { 
    this.automatorApiService.getTransaction(this.data.dbid,'transaction').subscribe(result =>{
     // console.log(result);
    });
  }

  ngOnInit() {
    
   // /v2/transaction/{sessionId}/{dbid}

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
