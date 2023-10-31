import { Injectable } from '@angular/core';
import {CanActivate} from '@angular/router';
import {AutomatorApiService} from './automator-api.service';
@Injectable({
providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private automatorApi: AutomatorApiService) { }

  canActivate() {
    //return true;
    let authDetail =JSON.parse(sessionStorage.getItem('authDetail'));
 //console.log(authDetail);
    if(authDetail) return true;
    else return false;
    // if(authDetail){
    //   this.automatorApi.basicAuth(authDetail)
    // .subscribe(response => {
    //   if(response === true)
    //   return true;
    //   else 
    //     return false;
    // }, 
    // err => {
    //  return false;
    // });
    // }
    // else
    // return false;


    // let key = sessionStorage.getItem('sesId');
    // if(key) return true;
    // else return false;
  }
}
