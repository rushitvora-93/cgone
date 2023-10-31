import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AutomatorApiService } from '../services/automator-api.service';
import { ToastrService } from 'ngx-toastr';
import { CopyEnvDialogComponent } from '../components/copy-env-dialogue/copy-env-dialog.component';

@Component({
  selector: 'app-copy-environment-list',
  templateUrl: './copy-environment-list.component.html',
  styleUrls: ['./copy-environment-list.css']
})
export class CopyEnvironmentListComponent implements OnInit {

  displayedColumns: string[] = ['id','envName'];
  environments: NewEnvironment[];
  @Input() isCopyEnvList: boolean = true;
  @Output() onRowSelect=new EventEmitter<any>();
  constructor(public dialog: MatDialog,private automatorApi: AutomatorApiService,private toastr: ToastrService){

  }

  
  ngOnInit() {
    this.getAllCopyEnv()
  }

  getAllCopyEnv(){
    this.automatorApi.getCopyEnvList()
    .subscribe((res:NewEnvironment[])=>{
      this.environments=res;
      
    })
  }

  copyNewEnvDialog(){
    const dialogRef = this.dialog.open(CopyEnvDialogComponent, {
          width: "600px"
        });
        dialogRef.afterClosed().subscribe((data) => {
          if(typeof data == 'object'){
            this.automatorApi.postCopyEnvApp(data)
            .subscribe(res=>{
              this.getAllCopyEnv();
              if (res != true) {
                this.toastr.error(
                  `Environment not copied.`,
                  "Failed!"
                );
              } 
              if (res == true){
                this.toastr.success(
                    "Environment Copied Successfully...",
                    "Success!"
                  );
              }
            },err=>{
              this.toastr.error(
                `Environment not copied.`,
                "Failed!"
              );
            })
          }
        })
      }

      selectRow(row){
        console.log("selected row "+JSON.stringify(row));
        this.onRowSelect.emit(row);
      }
}


export interface NewEnvironment {
  volume: number;
  id: number;
  envName: string;
}