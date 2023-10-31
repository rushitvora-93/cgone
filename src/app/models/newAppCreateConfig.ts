class Config {
    public appName: string;
    public version: string;
    constructor(
      public type: string
    ) {}
  }
  
  export class NewAppCreateConfig {
    public config: Config;
      constructor(
        public hostId: number,
        public automatorAppId: number,
        type: string
      ) {
        this.config = new Config(type);
      }
  
      public addNewPropertyToConfig(key: string, value: any) {
        this.config[key] = value;
      }
  }
  
  /**
  {
      "automatorAppId": 23,
      "hostId": 2,
      "config": {
        "appName": "GAX_Linux",
        "type": "CFGGenesysAdministratorServer",
        "version": "8.5.260.11",
        "connectedServers": [
          {
            "appServerId": 104,
            "timeoutLocal": 0,
            "timeoutRemote": 0,
            "mode": "CFGTMNoTraceMode",
            "id": "default",
            "longField1": 0,
            "longField2": 0,
            "longField3": 0,
            "longField4": 0
          },
          {
            "appServerId": 147,
            "timeoutLocal": 0,
            "timeoutRemote": 0,
            "mode": "CFGTMNoTraceMode",
            "id": "default",
            "longField1": 0,
            "longField2": 0,
            "longField3": 0,
            "longField4": 0
          },
          {
            "appServerId": 183,
            "timeoutLocal": 0,
            "timeoutRemote": 0,
            "mode": "CFGTMNoTraceMode",
            "id": "default",
            "longField1": 0,
            "longField2": 0,
            "longField3": 0,
            "longField4": 0
          }
        ],
        "serverInfo": [
          {
            "name": "Environment"
          }
        ],
        "port": 8000,
        "workingDirectory": "C:\\GCTI\\SCServer\\SCS_P"
      }
    }
   */
  
   /**
    {
      "automatorAppId":23,
      "hostId":1,
      "config":{
        "state":"CFGEnabled",
        "connectedServers":[
          {
            "mode":"CFGTMNoTraceMode",
            "longField3":0,
            "longField2":0,
            "longField4":0,
            "longField1":0,
            "appServerId":104,
            "timeoutRemote":0,
            "timeoutLocal":0,
            "id":"default"
          }
        ],
        "serverInfo":[{"name":"Enviornment"}],
        "port":800
      }
    }
  */
  /*
    {
      "automatorAppId":23,
      "hostId":102,
      "config": {,
        "appName":"New Tasty",
        "version":"8.5.260.11"
        "state":"CFGEnabled",
        "connectedServers": [
          {
            "mode":"CFGTMNoTraceMode",
            "longField3":"03",
            "longField2":"02",
            "longField4":"04",
            "longField1":"01",
            "appServerId":"10400",
            "timeoutRemote":"0001",
            "timeoutLocal":"0010",
            "id":"defaulter"
          },
          {
            "mode":"CFGTM1NoTraceMode",
            "longField3":"032",
            "longField2":"022",
            "longField4":"042",
            "longField1":"012",
            "appServerId":"104002",
            "timeoutRemote":"00012",
            "timeoutLocal":"00102",
            "id":"defaulter2"
          }
        ],
        "serverInfo":[
          {
            "name":"Enviornmentall"
          }
        ],
        "port":80090
      }
    }
  */
  
  /**
    {
      "hostId":104,
      "automatorAppId":23,
      "config":{
        "type":"CFGGenesysAdministratorServer",
        "state":"CFGEnabled",
        "connectedServers":[
          {
            "mode":"CFGTMNoTraceMode hey",
            "longField3":"013",
            "longField2":"012",
            "longField4":"014",
            "longField1":"011",
            "appServerId":"1041",
            "timeoutRemote":"0100",
            "timeoutLocal":"1000",
            "id":"default01"
          },
          {
            "mode":"CFGTMNoTraceMode Hey 2",
            "longField3":"023",
            "longField2":"022",
            "longField4":"024",
            "longField1":"021",
            "appServerId":"1042",
            "timeoutRemote":"0200",
            "timeoutLocal":"2000",
            "id":"default02"
          }
        ],
        "serverInfo":[
          {
            "name":"Enviornment Obje"
          }
        ],
        "port":80090,
        "appName":"HumApp1",
        "version":"8.5.260.11"
      }
    }
   */
  
  
  
  // WEBPACK FOOTER //
  // ./src/app/models/newAppCreateConfig.ts