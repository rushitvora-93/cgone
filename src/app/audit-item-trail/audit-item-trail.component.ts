import { Component, OnInit, Input, Output, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { AutomatorApiService } from './../services/automator-api.service';
import { get } from 'lodash';

@Component({
  selector: 'app-audit-item-trail',
  templateUrl: './audit-item-trail.component.html',
  styleUrls: ['./audit-item-trail.component.css']
})
export class AuditItemTrailComponent  {

  shouldShowOnlyDifference: boolean;
  config: any;
  id: any;
  objectType: any;
  envName: string;

  configurationItems: any[];
  oldConfiguration: any;
  newConfiguration: any;

  constructor(public dialogRef: MatDialogRef<AuditItemTrailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private automatorApi: AutomatorApiService,
    private toastr: ToastrService) {
      console.log('hi', data);
      this.config = this.parseConfiguration(data.value);
     // console.log(this.config);
      this.id = data.id;
      this.objectType = data.objectType;
      this.envName = data.envName;
  }

  parseConfiguration(config) {
    let newConfigObj={};
    let oldConfigObj={};
    let configurationList=[];
    if (config.NewConfiguration) {
      this.addConfigurationItem(
        config.NewConfiguration,
        newConfigObj,
        ''
      );
    }
    if (config.OldConfiguration) {
      this.addConfigurationItem(
        config.OldConfiguration,
        oldConfigObj,
        ''
      );
    }

    Object.keys(newConfigObj).forEach(k=>{
      if(newConfigObj[k].isObject){
        configurationList.push({
          configKey:k,
          isObject:true
        })
      }else{
        configurationList.push({
          configKey:k,
          newConfig:newConfigObj[k].val,
          oldConfig:oldConfigObj[k]?oldConfigObj[k].val:undefined,
          isChanged:oldConfigObj[k]?newConfigObj[k].val!==oldConfigObj[k].val:true
        })
      }
      delete oldConfigObj[k]
    })
    Object.keys(oldConfigObj).forEach(k=>{
      if(oldConfigObj[k].isObject){
        configurationList.push({
          configKey:k,
          isObject:true
        })
      }else{
        configurationList.push({
          configKey:k,
          oldConfig:oldConfigObj[k].val,
          isChanged:true
        })
      }
    })
   
    this.configurationItems = configurationList;
  }

  addConfigurationItem(configuration,configObj,parentKey) {
    if(Array.isArray(configuration)){
      configuration.forEach((val,index)=>{
        if(Array.isArray(val)){
          if(parentKey!==''){
            configObj[parentKey+'.['+index+']']={isObject:true};
          }
          this.addConfigurationItem(val,configObj,parentKey!==''?parentKey+'.['+index+']':'['+index+']');
        }
        else if(typeof val=='object' ){
          if(parentKey!==''){
            configObj[parentKey+'.['+index+']']={isObject:true};
          }
          this.addConfigurationItem(val,configObj,parentKey!==''?parentKey+'.['+index+']':'['+index+']');
  
        }else{
          configObj[parentKey+'.['+index+']']={val:val};
        }
      })
    }
    else if(typeof configuration =='object'){
      Object.keys(configuration).forEach(key => {
        if(!configuration[key]){
          configObj[parentKey!==''?parentKey+'.'+key:key]={val:null};
        }else if(Array.isArray(configuration[key])){
          if(parentKey!==''){
            configObj[parentKey+'.'+key]={isObject:true};
          }
          this.addConfigurationItem(configuration[key],configObj,parentKey!==''?parentKey+'.'+key:key);
        }
        else if(typeof configuration[key]=='object' ){
          if(parentKey!==''){
            configObj[parentKey+'.'+key]={isObject:true};
          }
          this.addConfigurationItem(configuration[key],configObj,parentKey!==''?parentKey+'.'+key:key);
  
        }else{
          configObj[parentKey!==''?parentKey+'.'+key:key]={val:configuration[key]};
        }
      });
    }
    
  }

  toggleShowOnlyDifference() {
    if (!this.shouldShowOnlyDifference) {
      this.shouldShowOnlyDifference = true;
    } else {
      this.shouldShowOnlyDifference = false;
    }
  }

  isString (value) {
    return typeof value === 'string' || value instanceof String;
  }

  isNumber (value) {
    return typeof value === 'number' && isFinite(value);
  }

  isBoolean (value) {
    return typeof value === 'boolean';
  }

  isArray (value) {
    return value && typeof value === 'object' && value.constructor === Array;
  }

  isArrayNew (value, a, b, c) {
    return value && typeof value === 'object' && value.constructor === Object;
  }

  isObject (value) {
    return value && typeof value === 'object' && value.constructor === Object;
  }

  objectKeys(obj) {
    return Object.keys(obj);
  }

  getKeyLabel(key) {
    return key;
  }

  rollBack(rollbackId, envName) {
    const rollbackIDList = [];
    rollbackIDList.push(rollbackId);
    this.automatorApi.postAuditRollback(rollbackIDList, envName).subscribe(result => {
      this.toastr.success('Rollback Successfully...', 'Success!');
      this.dialogRef.close();
    });
  }


  close() {
    this.dialogRef.close();
  }

  isObjectChanged(object) {
    if (object && object.configKey) {
      const objectsRelated = this.configurationItems.filter(
        item => item && item.isChanged && item.configKey
          && (item.configKey.startsWith(object.configKey + '[')
            || item.configKey.startsWith(object.configKey + '.')
            || item.configKey === object.configKey));
      return objectsRelated && objectsRelated.length > 0;
    } else {
      return false;
    }
  }

  // saveValue(){
  //   if(this.eventType == 'ApplicationDetail'){
  //     this.ApplicationDetailCallback.emit(this.config);
  //   }
  //   else if(this.eventType == 'ConfigurationType' || this.eventType == 'BothEventsStep4'){
  //     let arr = this.eventType == 'BothEventsStep4' ?  this.bothTypeAppLists : this.configurationSelectedItemList;
  //     let obj  = {}
  //     this.selectedEvents[this.eventType] = this.config;
  //          obj = {key : this.eventType,value : arr,moveNext : this.stepper}
  //         this.callbackSelectedEvents.emit(obj);
  //   }
  //   else{
  //     let obj  = {}
  //     this.selectedEvents[this.eventType] = this.config;
  //         // this.selectedEvents[this.eventType].push();
  //          obj = {key : this.eventType,value : this.selectedEvents[this.eventType],moveNext : this.stepper}
  //         this.callbackSelectedEvents.emit(obj);
  //   }

  // }


}
