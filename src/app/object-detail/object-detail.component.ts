import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import {AutomatorApiService} from '../services/automator-api.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig} from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { NewObjectDialogComponent } from '../new-object-dialog/new-object-dialog.component';
import { ObjectDetailDialogComponent } from '../object-detail-dialog/object-detail-dialog.component';
import { RoutingEventsMapping } from '../models/RoutingEventsMapping.model';
import { ListEventMapping } from '../models/list-event-mapping.model';
import _ from 'underscore';


@Component({
  selector: 'app-object-detail',
  templateUrl: './object-detail.component.html',
  styleUrls: ['./object-detail.component.css']
})
export class ObjectDetailComponent implements OnInit {
  @Input() objectValue: any;
  @Input() eventType : any;
  @Output() SelectedValue : EventEmitter<any> = new EventEmitter();
  eventPropertyType : any;
  @Input() showType: boolean
  constructor(private automatorApi: AutomatorApiService, public dialog: MatDialog, private toastr:ToastrService) { }

  ngOnInit() {
}



newObjectDialog(){

  // if(this.eventType != 'v2transaction'){

  //   const dialogRef = this.dialog.open(NewObjectDialogComponent, {
  //     width: '420px'
  //   });
  
  //   dialogRef.afterClosed().subscribe(result => {
  //     if(result && result!='cancel')
  //     {
  //       this.automatorApi.addUser(result)
  //       .subscribe(response=>{
  //         //console.log(response);
  //         if(response)
  //         this.toastr.success('New Object Created Successfully...', 'Success!');
  //        },
  //       err =>{
  //         this.toastr.error(`Oops...Not able to create Object.`, 'Failed!');
  //       });
  //     }
  //   });
  // }

    let obj = RoutingEventsMapping.transactionType[this.eventType.toLowerCase()];
    obj['eventType'] = this.eventType;
    this.SelectedValue.emit(obj);
  //}
  
}
mappingWithChild(){
  let apiObj = {
    'placeDBID' : 'places/{sessionId}',
    'capacityRuleDBID' : 'list/{sessionId}/capacityscript',
    'siteDBID' : '',
    'costContractDBID' : ''
  }
}

ShowDetails(val){

  let event = this.eventType.toLowerCase();
  this.eventPropertyType = ListEventMapping.ListEventType[event];

  this.automatorApi.getTransaction(val.dbid, event).subscribe(result => {
    if (result) {
      result = result.length > 0 ? result[0] : result;

      result['eventType'] = this.eventType;
      result = result.length > 0 ? result[0] : result;
      if(this.eventPropertyType){
        for (var element in result) {
          if (this.eventPropertyType.hasOwnProperty(element)) {
             if(element == 'agentInfo' && this.eventPropertyType == 'users' ){
                this.mappingWithChild()
             }
             result['propertyName'] = this.eventPropertyType[element].propertyName;
             result['mappedKeyName']= this.eventPropertyType[element].mappedKeyName;
           
             let url = this.eventPropertyType[element].api.replace('{sessionId}',sessionStorage.getItem('sesId'));
           
                if(! url.includes('{switchid}'))
                this.automatorApi.getListOfEventType(url).subscribe(
              response => {
               
                  this.eventPropertyType[response.type]['result'] = response;
                  if (response.type && response.list.length > 0) {
                        if(this.eventPropertyType[response.type]['mappedKeyName'] != undefined){
                          let list = response.list.filter(x => x[this.eventPropertyType[response.type]['mappedKeyName']] == result[response.type]);
                          result[response.type] = list.length > 0 ?  list[0][this.eventPropertyType[response.type]['propertyName']] : result[response.type];
                        }
                        //this code is written to map property name && mapped name, for single arrays
                       else {
                         var mappedProperty = response.list.find(element => {
                           return element.mappedName === result[response.type]
                         });
                         result[response.type] = mappedProperty.propertyName;
                        // result[response.type] =  _.findWhere(response.list,function(item){
                        //   if(item.mappedName == result[response.type])
                        //      return item;
                        // }).propertyName;
                       } 
                    localStorage.setItem('selectedListEventType', this.eventType.toLowerCase());
                    this.SelectedValue.emit(result);
                  }
  
              }
            )
          }
        }
      }
      else{
        this.SelectedValue.emit(result);
        localStorage.setItem('selectedListEventType', this.eventType.toLowerCase());
      }

    }
  });
}

deleteObject(dbId:number){
   this.automatorApi.deleteObject(dbId, this.eventType.toLowerCase()).
   subscribe(result =>{
    this.toastr.success('Deleted Successfully...', 'Success!');
    this.automatorApi.getPlaces(this.eventType.toLowerCase()).subscribe(result=>{
      this.objectValue = result;
     // console.log(this.objectValue);
    });
   },
  err =>{
    if(err.status === 200)
      {
        this.toastr.success('Deleted Successfully...', 'Success!');
        this.automatorApi.getPlaces(this.eventType.toLowerCase()).subscribe(result=>{
          this.objectValue = result;
         // console.log(this.objectValue);
        });
      }
  }
  )
}


}