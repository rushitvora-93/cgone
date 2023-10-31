import { Component, OnInit,Inject, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-create-new-env-dialog',
  templateUrl: './create-new-env-dialog.component.html',
  styleUrls: ['./create-new-env-dialog.component.css']
})
export class CreateNewEnvDialogComponent implements OnInit {

  checked=false;
  env:any={
    channelVol: []
  }
  @Input() showInfo: any;
  @Input() channels: any;  show: boolean;
  channelmod:any;
  volumemod:any;
  channelVol: any = []
  constructor(public dialogRef: MatDialogRef<CreateNewEnvDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {}

  

  saveEnv(form){
    // console.log(this.env);
    
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
    this.show = false
  }
  
}
