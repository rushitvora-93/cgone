import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ToastrService } from "ngx-toastr";
import { SetupNewEnvDialogComponent } from '../components/setup-new-env-dialogue/setup-new-env-dialog.component';
import { AutomatorApiService } from '../services/automator-api.service';
import { SetupNewServerDialogComponent } from '../components/setup-new-server-dialogue/setup-new-server-dialog.component';


@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {
  environments: any[];
  refreshEnv;
  objectTypes: any;
  auditObjectType:any;
  auditEnv:any;

  constructor(public dialog: MatDialog,private automatorService:AutomatorApiService,private toastr: ToastrService) { }

  ngOnInit() {
    this.getAllEnvironment();
    this.getObjectTypes();
  }

  showNewEnvDialog(){
      const dialogRef = this.dialog.open(SetupNewEnvDialogComponent, {
        width: "420px"
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result !='cancel' && typeof result=='object'){
          this.automatorService.addEnv([result])
          .subscribe(res=>{
            this.toastr.success(
              "Environment added Successfully...",
              "Success!"
            );
            this.getAllEnvironment();
          },err=>{
            this.toastr.error(
              "Failed to add environment...",
              "Error!"
            );
          })
        }
      })
    }

    showNewServerDialog(){
      const dialogRef = this.dialog.open(SetupNewServerDialogComponent, {
        width: "420px"
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result !='cancel' && typeof result=='object'){
          this.automatorService.addServer([result])
          .subscribe(res=>{
            this.toastr.success(
              "Server added Successfully...",
              "Success!"
            );
            this.getAllEnvironment();
          },err=>{
            this.toastr.error(
              "Failed to add server...",
              "Error!"
            );
          })
        }
      })
    }

    getAllEnvironment(){
      this.automatorService.getAllEnv()
      .subscribe(envs=>{
        this.environments=envs;
        this.refreshEnv=this.environments[0];
        this.auditEnv=this.environments[0];
      })
    }
  
    refreshTemplate(){
      this.automatorService.refreshTemplates(this.refreshEnv.id)
      .subscribe(res=>{
        this.toastr.success(
          "Template refreshed Successfully...",
          "Success!"
        );
      },err=>{
        this.toastr.success(
          "Template Refresh Failed...",
          "Error!"
        );
      })
    }

    getObjectTypes(){
      this.automatorService.getObjectType()
      .subscribe(res=>{
        this.objectTypes=res.list;
        this.auditObjectType=this.objectTypes[0];
      },err=>{
        
      })
    }

    refreshAuditHistory(i){
      this.objectTypes[i].status='in progress';
      this.automatorService.refreshAuditData(this.auditEnv.appName,this.objectTypes[i].mappedName)
      .subscribe(res=>{
        this.objectTypes[i].status='success';
      },err=>{
        this.objectTypes[i].status='failed';
      })
    }

    restartServer(){
      this.automatorService.restartServer()
      .subscribe(res=>{
        this.toastr.success(
          "Restart initiated Successfully...",
          "Success!"
        );
      },err=>{
        this.toastr.error(
          "Restart failed",
          "Error!"
        );
      })
    }
    
}
