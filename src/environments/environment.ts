// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  isTelephonyActive: false,
  isRoutingactive: false,
  isAccountingActive: false,
  isOutboundActive: false,
  oneConnect: true,
  oneTrack: true,
  oneChange: true,
  oneDesign: true,
  oneTest: true,
  home: true,
  homeDescription: 'A unique tool which gives you flexibility and helps you to manage your contact centre more efficiently Fully automated One- Click Admiration for Geneseys',
  // apiBaseUrl:'http://automator.logicsoft.co.uk:8082/auto3/v2'
  // apiBaseUrl:'http://vpn.logicsoft.co.uk:8901/api/v2'
  apiBaseUrl: 'http://demo.onecg.cc:8901/api/v2',
  loginApiBaseUrl: 'http://demo.onecg.cc:8901',
  //apiBaseUrl:'http://mb2tlucp164.bccn.local:8901/api/v2'
  // apiBaseUrl:'http://automator.logicsoft.co.uk:8901/api/v2'

};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
