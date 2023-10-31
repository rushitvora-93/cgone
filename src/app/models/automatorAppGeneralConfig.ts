import { AutomatorAppGeneralConfigKey } from './automatorAppGeneralConfigKey';

export class AutomatorAppGeneralConfig {

    public automatorAppId: number;
    public label: string;
    public versions: string[];
    public keys: AutomatorAppGeneralConfigKey[];

    constructor() {  }
}


/**
{
    "label": "CFGGenesysAdministratorServer",
    "automatorAppId": 23,
    "versions": [
        "8.5.260.11",
        "8.5.260.12"
    ],
    "keys": [
        {
            "id": 1,
            "key": "state",
            "type": "STRING",
            "readOnly": true,
            "defaultValue": "CFGEnabled"
        },
        {
            "id": 2,
            "key": "connectedServers",
            "type": "ARRAY",
            "readOnly": false,
            "defaultValue": {
                "mode": "CFGTMNoTraceMode",
                "longField3": 0,
                "longField2": 0,
                "longField4": 0,
                "longField1": 0,
                "appServerId": 104,
                "timeoutRemote": 0,
                "timeoutLocal": 0,
                "id": "default"
            }
        },
        {
            "id": 3,
            "key": "serverInfo",
            "type": "OBJECT",
            "readOnly": false,
            "defaultValue": {
                "name": "Enviornment"
            }
        },
        {
            "id": 4,
            "key": "port",
            "type": "INTEGER",
            "readOnly": false,
            "defaultValue": 800
        }
    ]
}
 */



// WEBPACK FOOTER //
// ./src/app/models/automatorAppGeneralConfig.ts