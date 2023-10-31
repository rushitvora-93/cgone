import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';
import { AddConnectedServerDialogComponent } from '../create-new-connected-server-dialog/add-connected-server-dialog.component';
import { AutomatorApiService } from 'src/app/services/automator-api.service';

@Component({
  selector: 'app-create-new-env-host-app-dialog',
  templateUrl: './create-new-env-host-app-dialog.component.html',
  styleUrls: ['./create-new-env-host-app-dialog.component.css']
})
export class CreateNewEnvHostAppDialogComponent implements OnInit {

  checked=false;
  types: any = []
  app:any={appConfig:{appId:0,connectedServers:[]},id:0}
  versions: any[];
  constructor(public dialogRef: MatDialogRef<CreateNewEnvHostAppDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialog,private apiService: AutomatorApiService) {}

  ngOnInit() {
    // this.getAppType()
  }

  

  saveApp(form){
    this.app.appConfig.state=this.app.appConfig.state?'CFGEnabled':'CFGDisabled';
    this.app.appConfig.appName=this.app.appName;
    this.dialogRef.close(this.app);
  }

  addConnectedServer(){
      const dialogRef = this.dialog.open(AddConnectedServerDialogComponent, {
        data: {
          appName: this.app.appConfig.appName
        },
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result!='cancel' && typeof result=='object') {
          if(!this.app.appConfig.connectedServers){
            this.app.appConfig.connectedServers=[];
          }
          this.app.appConfig.connectedServers.push(result);
        }
      })
     
    
  }

  getAppType(){
    this.apiService.getallapptype().subscribe(data => {
      this.objlist(data)
    }, err=> {
      console.log(err);
    })
  }

  public objlist(data){ 
    const opt = []
    for (let index = 0; index < Object.keys(data.list).length; index++) {
      opt.push(data.list[index].propertyName)
    }
    this.types = opt
    console.log(this.app.appConfig.type)
  }

  getAllAppType(){
    this.apiService.getVerList(this.app.appConfig.type).subscribe(res => {
      this.verlist(res)
    }, err => {
      console.log(err);
    })
  }
  public verlist(data){ 
    const opt = []
    for (let index = 0; index < Object.keys(data).length; index++) {
      opt.push(data[index])
    }
    this.versions = opt
    console.log(this.versions);
  }
  
  cancelCreateApp(){
    this.dialogRef.close('cancel');
  }

  removeConnectedServer(option,index){
    this.app.appConfig.connectedServers = this.app.appConfig.connectedServers.filter((o,i) => i !== index);
  }

  
}
