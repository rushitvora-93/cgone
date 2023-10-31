import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';
import { AutomatorApiService } from 'src/app/services/automator-api.service';

@Component({
  selector: 'app-setup-new-server-dialog',
  templateUrl: './setup-new-server-dialog.component.html',
  styleUrls: ['./setup-new-server-dialog.component.css']
})
export class SetupNewServerDialogComponent implements OnInit {

  checked=false;
  server:any={}
  foods=['aapple']
  environments: any;
  confServApp:any;
  constructor(public dialogRef: MatDialogRef<SetupNewServerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private automatorService:AutomatorApiService) {}

  ngOnInit() {
    this.getAllEnvironment();
  }

  

  saveEnv(form){
    this.server.id=0;
    this.dialogRef.close(this.server);
  }

  
  cancelIgnoreList(){
    this.dialogRef.close('cancel');
  }

  getAllEnvironment(){
    this.automatorService.getAllEnv()
    .subscribe(envs=>{
      this.confServApp=envs[0];
      this.environments=envs;
      this.setEnv();
    })
  }
  
  setEnv(){
    this.server.confServAppName=this.confServApp.appName;
    this.server.confServUser=this.confServApp.user;
    this.server.confServPassword=this.confServApp.password;
    this.server.confServHost=this.confServApp.host;
    this.server.confServPort=this.confServApp.port;
    this.server.confServClientName=this.confServApp.clientName;
  }
}
