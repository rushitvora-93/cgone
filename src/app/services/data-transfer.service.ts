import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable()
export class DataTransferService {
// TODO: for default value, when service is down
//  private dropAppDetail = new BehaviorSubject<any>({'automatorApp': {'automatorAppId': 23}, 'host': {'hostId': 1}});
  private dropAppDetail = new BehaviorSubject<any>({});
  currentDropAppDetail = this.dropAppDetail.asObservable();

  private newAppActivity = new BehaviorSubject<any>({});
  currentAppActivity = this.newAppActivity.asObservable();

  private selectAppDetail = new BehaviorSubject<any>({});
  currentSelectAppDetail = this.selectAppDetail.asObservable();

  private newHostActivity = new BehaviorSubject<any>({});
  currentHostActivity = this.newHostActivity.asObservable();

  constructor() { }

  changeDropedAppDetails(dropAppDetail: any) {
    //console.log('App Drop Details Changed..', JSON.stringify(dropAppDetail));
    this.dropAppDetail.next(dropAppDetail);
  }

  changeNewAppActivity(newAppActivity: any) {
    //console.log('New activity on new app..', JSON.stringify(newAppActivity));
    this.newAppActivity.next(newAppActivity);
  }

  changeSelectedAppDetails(selectAppDetail: any) {
    //console.log('App Select Details Changed..', JSON.stringify(selectAppDetail));
    this.selectAppDetail.next(selectAppDetail);
  }

  changeNewHostActivity(activityDetails: any) {
    //console.log('New Host Activity Happened..', JSON.stringify(activityDetails));
    this.newHostActivity.next(activityDetails);
  }

}



// WEBPACK FOOTER //
// ./src/app/services/data-transfer.service.ts