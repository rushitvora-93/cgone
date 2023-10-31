import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CreateNewEnvDialogComponent } from '../components/create-new-env-dialogue/create-new-env-dialog.component';
import { AutomatorApiService } from '../services/automator-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-environment-list',
  templateUrl: './environment-list.component.html',
  styleUrls: ['./environment-list.component.css']
})
export class EnvironmentListComponent implements OnInit {

  displayedColumns: string[] = ['id','envName','volume'];
  environments: NewEnvironment[];
  landingpage:boolean = true;
  @Input() isEnvList: boolean = true;
  @Output() onRowSelect=new EventEmitter<any>();
  constructor(public dialog: MatDialog,private automatorApi: AutomatorApiService,private toastr: ToastrService){

  }

  
  ngOnInit() {
    this.getAllEnvironments();
    console.log('from getAllEnvironments');
    this.landingpage = false;
  }

  getAllEnvironments(){
    this.automatorApi.getNewEnvList()
    .subscribe((res:NewEnvironment[])=>{
      this.environments=res;
    })
  }

  createNewEnvDialog(){
    const dialogRef = this.dialog.open(CreateNewEnvDialogComponent, {
          width: "600px"
        });
        dialogRef.afterClosed().subscribe((data) => {
          if(typeof data == 'object'){
            this.automatorApi.createNewEnv(data)
            .subscribe(res=>{
              this.getAllEnvironments();
              this.toastr.success(
                "New Environment Created Successfully...",
                "Success!"
              );
            },err=>{
              this.toastr.error(
                `Oops...Not able to create New Environment.`,
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