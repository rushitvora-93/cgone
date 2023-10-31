import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
import { MatStepper } from '@angular/material';
import { AutomatorApiService } from '../services/automator-api.service';

@Component({
  selector: 'app-promote-config',
  templateUrl: './promote-config.component.html',
  styleUrls: ['./promote-config.component.css']
})
export class PromoteConfigComponent implements OnInit {

  @Input() config: any;
  @Input('SubmitEventName') SubmitEventName : string;
  @Input() stepper : MatStepper;
  @Input('CancelEventName') CancelEventName : string;

  @Output() callbackSelectedEvents : EventEmitter<any> =  new EventEmitter();
  @Output() BackStepper : EventEmitter<any> = new EventEmitter();

  selectedApps : any = [];


  constructor() { }

  ngOnInit() {
  }

  checkIfPromote(index){
    if(this.config[index].hasOwnProperty('automatorAppId'))
       return false;
    
      return true;
  }
  getConfigList(config,index,event){
    if(event.checked){
      this.selectedApps.push(config[index]);
    }
    else{
      this.selectedApps.splice(index,1);
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

  isObject (value) {
    return value && typeof value === 'object' && value.constructor === Object;
  }

  objectKeys(obj) {
    return Object.keys(obj);
  }

  getKeyLabel(key) {
    return key;
  }

  getHostId(event : any,config){
    config["selectedHostId"] = parseInt(event.target.value);
  }

  saveValue(){

      let callback = {};
      callback['PromoteType'] = []
      callback['ConfigurationType'] = [];
      callback['ConfigurationType'] = this.parseArray(callback['ConfigurationType'],this.selectedApps);
      callback['PromoteType'] =  this.parseArray(callback['PromoteType'],this.config,'automatorAppId');
      this.callbackSelectedEvents.emit(callback);
      this.stepper.next();

  }
  parseArray(emptyArray, fullarrray, condtionForpromote?) {
    for (var i = 0; i < fullarrray.length; i++) {
      if (condtionForpromote && fullarrray[i].hasOwnProperty(condtionForpromote)) {
        emptyArray.push(fullarrray[i])
      }
      else if(! condtionForpromote)
        emptyArray.push(fullarrray[i]);
    }
    return emptyArray;
  }
  BackStep(){
    this.BackStepper.emit(this.stepper);
  }


}