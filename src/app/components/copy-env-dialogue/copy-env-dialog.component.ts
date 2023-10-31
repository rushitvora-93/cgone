import { Component, OnInit,Inject, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';
import { AutomatorApiService } from 'src/app/services/automator-api.service';

@Component({
  selector: 'app-copy-env-dialog',
  templateUrl: './copy-env-dialog.component.html',
  styleUrls: ['./copy-env-dialog.component.css']
})
export class CopyEnvDialogComponent implements OnInit {

  checked=false;
  env:any={
    channelVol: [],
    // newEnvName:'',
    fromEnvId:''
  }
  @Input() showInfo: any;
  @Input() channels: any;
  show: boolean
  channelVol: any = []
  newEnvName:any;
  allEnvList: any = [];
  channelmod:any;
  volumemod:any;
  constructor(public dialogRef: MatDialogRef<CopyEnvDialogComponent>,private automatorApi: AutomatorApiService,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {  
    this.getAllEnvList()
  }

  

  saveEnv(form){
    this.dialogRef.close(this.env);
  }

  
  cancelIgnoreList(){
    this.dialogRef.close('cancel');
  }
  onAddChannel(){
    this.show = true
    console.log('onAddChannel');
  }
  saveChannel(){
    if(this.channelmod!='' && this.volumemod != ''){
      this.env.channelVol.push({channel:this.channelmod,volume:this.volumemod})
    this.channelVol.push({channel:this.channelmod,volume:this.volumemod})
    
    }
    // console.log(this.newEnvName);
    // this.env.newEnvName = this.newEnvName
    this.show = false
  }

  // cpy env
  getAllEnvList() {
		// http://demo.onecg.cc:8901/api/v2/envlist/getallenv
		this.automatorApi.getAllEnv().subscribe(result => {
			if(!result){
				return;
			}
			this.allEnvList = result.map(res => ({
				value: res.id,
				label: res.appName
			}));
			// this.envName = this.allEnvList[0].label;
			console.log(this.allEnvList);
		});
	}
  
  selectedEnv(val){
    
    this.env.fromEnvId = val.value
    console.log(this.env.fromEnvId);
  }

  
  
}
