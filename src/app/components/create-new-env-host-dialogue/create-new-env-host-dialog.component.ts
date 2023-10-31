import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';
import { AutomatorApiService } from 'src/app/services/automator-api.service';

@Component({
  selector: 'app-create-new-env-host-dialog',
  templateUrl: './create-new-env-host-dialog.component.html',
  styleUrls: ['./create-new-env-host-dialog.component.css']
})
export class CreateNewEnvHostDialogComponent implements OnInit {

  checked=false;
  host:any={hostConfig:{state:true,options:{},lcaPort:0}}
  osList: any[];
  constructor(public dialogRef: MatDialogRef<CreateNewEnvHostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private automatorService:AutomatorApiService) {}

  ngOnInit() {
    if(this.data && this.data.host && this.data.host.id!=0){
      this.host=Object.assign({},this.data.host);
      this.host.hostConfig=Object.assign({},this.host.hostConfig);
      this.host.hostConfig.state=this.host.hostConfig.state=='CFGEnabled';
    }
    this.getOSTypes();
  }

  getOSTypes(){
    this.automatorService.getOSList()
    .subscribe((res:any)=>{
      this.osList=res.list;
    },err=>{

    })
  }
  

  saveHost(form){
    this.host.hostConfig.status=this.host.hostConfig.status?1:0;
    this.host.hostConfig.state=this.host.hostConfig.state?'CFGEnabled':'CFGDisabled';
    this.host.hostConfig.hostId=0;
    this.host.id=this.host.id!=0?this.host.id:0;
    this.dialogRef.close(this.host);
  }

  
  cancelIgnoreList(){
    this.dialogRef.close('cancel');
  }

  
}
