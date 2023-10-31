export class RoutingEventsMapping {
  // whenever you add new event, please remove array in options key. Only pass in single empty object
  public static transactionType : any = {
      'transaction' : {
        "name" : "",
        "tenantDBID": 0,
        "type" : "",
        "alias" : "",
        "recordPeriod" : 0,
        "state" : "",
        "options" : {},
        "format" : "",
        "dbid" : 0
      },
      'objectivetable' : {
        "name" : "",
        "tenantDBID": 0,
        "state" : "",
        "type" : "",
        "description" : "",
        "objectiveRecords" : {
          "mediaType": "",
          "serviceType" : '',
          "segment" : ''
        },
        "prepaidCost" : 0,
        "timezone" : "",
        "contractStartTime" : "",
        "contractEndTime" : "",
        "options" : {},
        "objectiveTablePlace" : {
          "name" : '',
          "state" : ''
        },
        "objectiveTablePlaceGroup" : {
          "name" : '',
          "state" : ''
        },
        "dbid" : 0
      },
      'orchestration' : {
          "name" : "",
          "tenantDBID": 0,
          "type" : "",
          "state" : "",
          "options" : {},
          "dbid" : 0
      },
      'routingscript' : {
          "name" : "",
          "tenantDBID": 0,
          "type" : "",
          "state" : "",
          "options" : {},
          "dbid" : 0
      },
      'businessattribute' : {
          "dbid" : 0,
          "name" : "",
          "displayname" : "",
          "type" : "",
          "tenantDBID": 0,
          "state" : "",
          "userProperties" : [{}]
          
      }
      ,'scripts' : {
          "name" : "",
          "tenantDBID": 0,
          "type" : "",
          "state" : "",
          "options" : {},
          "dbid" : 0
      }
      ,'codes' : {
          "name": "",
          "tenantDBID": 0,
          "type": "",
          "code": "",
          "dbid": 0
      },
      'skills' : {
          // "status": 0,
          "dbid": 0,
          "skillName": "",
          "tenantDBID": 0,
          "state": "",
          "options": 
            {}
          ,
          "skillPerson": [
            {
              "dbid": 0,
              "name": "",
              "type": ""
            }
          ]
      },
      'interactionqueue' :  {
          // "status": 0,
          "dbid": 0,
          "name": "",
          "tenantDBID": 0,
          "phySwitchID": 0,
          "phySwitchType": 0,
          "phySwitchName": "",
          "gettServerID": 0,
          "linkType": "",
          "state": "",
          "cdnName": "",
          "cdnType": "",
          "cdnState": "",
          "options": {},
          "dnDBID": 0,
          "agentDBID": 0,
          "loginCode": "",
          "agentState": "",
          "agentLogin": [
            {
              "agentDBID": 0,
              "loginCode": "",
              "agentState": ""
            }
          ],
          "switchDn": [
            {
              "dnDBID": 0,
              "cdnName": "",
              "cdnType": "",
              "cdnState": ""
            }
          ],
          "actionCode": [
            {
              "switchDBID": 0,
              "accessCode": "",
              "routeType": "",
              "targetType": ""
            }
          ]
        },
      'solutions' : {
          "name": "",
          "tenantDBID": 0,
          "type": "",
          "solutionType": "",
          "version": "",
          "state": "",
          "options": 
            {}
          ,
          "componentDefinition": [
            {
              "startupPriority": 0,
              "isOptional": "",
              "type": "",
              "version": ""
            }
          ],
          "scsdbid": 0,
          "solutionComponent": [
            {
              "startupPriority": 0,
              "isOptional": "",
              "appDBID": 0
            }
          ],
          "dbid": 0
        },
      'timezone' :   {
          // "status": 0,
          "tenantDBID": 0,
          "name": "",
          "state": "",
          "nameNetscape": "",
          "nameMSExplorer": "",
          "isDSTObserved": "",
          "offset": 0,
          "description": "",
          "options": 
            {}
          ,
          "isDstObserverd": "",
          "dbid": 0
        },
      'statisticaldays' : {
          "name": "",
          "tenantDBID": 0,
          "state": "",
          "type": "",
          "isDayOfWeek": "",
          "day": 0,
          "maxValue": 0,
          "targetValue": 0,
          "intervalLength": 0,
          "dbid": 0
        },
       'statisticaltable' :  {
          "name": "",
          "tenantDBID": 0,
          "state": "",
          "type": "",
          "options": {},
          "statTableDays": [
            {
              "name": "",
              "state": "",
              "type": ""
            }
          ],
          "statTablePlace": [
            {
              "name": "",
              "state": ""
            }
          ],
          "dbid": 0
        },
        'places':
            {
              "name": "",
              "tenantDBID": 0,
              "state": "",
              "dbid": 0,
              "options": [
                {}
              ],
              "dn": [
                {
                  "number": "",
                  "type": "",
                  "state": "",
                  "dbId": 0
                }
              ],
              "capacityRule": "",
              "costContract": "",
              "site": "",
              "siteDBId": 0,
              "capacityRuleDBID": 0,
              "costContractDBID": 0,
              "group": [
                {
                  "name": "",
                  "type": ""
                }
              ]
            },
       'placegroups' : {
          "tenantDBID": 0,
          "name": "",
          "state": "",
          "places": "",
          "capacityTable": "",
          "quotaTable": "",
          "contract": "",
          "site": "",
          "options": 
            {}
          ,
          "placeGroupDn": [
            {
              "name": "",
              "type": "",
              "state": ""
            }
          ],
          "placeGroupPlace": [
            {
              "name": "",
              "state": ""
            }
          ],
          "dbid": 0
        },
       
        'accessgroup': 
          {
            "name": "",
            "tenantDBID": 0,
            "state": "",
            "groupInfo": "",
            "type": "",
            "options": {},
            "user": [
              {
                "username": "",
                "email": "",
                "password": "",
                "newPassword": "",
                "oldPassword": ""
              }
            ],
            "role": [
              {
                "name": "",
                "rolePrivileges": [
                  {}
                ]
              }
            ],
            "dbid": 0
          },
        'agentgroup' : {
          "name": "",
          "tenantDBID": 0,
          "managerDBIDS": [
            0
          ],
          "agentDBIDS": [
            0
          ],
          "options": {},
          "capacityTable": "",
          "originationDN": [
            {
              "number": "",
              "type": "",
              "state": ""
            }
          ],
          "supervisors": [
            {
              "username": "",
              "firstname": "",
              "lastname": "",
              "employeeId": "",
              "state": "",
              "agent": ""
            }
          ],
          "agents": [
            {
              "username": "",
              "isAgent": "",
              "lastname": "",
              "firstname": "",
              "emmployeeId": "",
              "state": ""
            }
          ],
          "dbid": 0
        },
        'roles' : {
          "name": "",
          "tenantDBID": 0,
          "objectDBID": 0,
          "objectType": "",
          "state": "",
          "description": "",
          "rolePrivileges": [
            {}
          ],
          "roleMember": [
            {
              "objectDBID": 0,
              "objectType": ""
            }
          ],
          "dbid": 0
        },
        'requestlog' : {
          "name": "",
          "tenantDBID": 0,
          "type": "",
          "description": "",
          "dbTableName": "",
          "dbAccessDBID": 0,
          "isCachable": "",
          "dbid": 0
        },
        'fields' :  {
          "name": "",
          "tenantDBID": 0,
          "type": "",
          "description": "",
          "length": 0,
          "fieldtype": "",
          "defaultvalue": "",
          "isPrimarykey": "",
          "isUnique": "",
          "isNullable": "",
          "state": "",
          "options": {},
          "fieldFormat": [
            {
              "name": "",
              "type": ""
            }
          ],
          "dbid": 0
        },
        'formats' : {
          "name": "",
          "tenantDBID": 0,
          "description": "",
          "state": "",
          "options": 
            {}
          ,
          "field": [
            {
              "name": "",
              "datatype": "",
              "fieldtype": "",
              "state": ""
            }
          ],
          "dbid": 0
        },
        'switches' : {
         
          "dbid": 0,
          "name": "",
          "tenantDBID": 0,
          "phySwitchID": 0,
          "phySwitchType": 0,
          "phySwitchName": "",
          "gettServerID": 0,
          "linkType": "",
          "state": "",
          "cdnName": "",
          "cdnType": "",
          "cdnState": "",
          "options": {},
          "dnDBID": 0,
          "agentDBID": 0,
          "loginCode": "",
          "agentState": "",
          "agentLogin": [
            {
              "agentDBID": 0,
              "loginCode": "",
              "agentState": ""
            }
          ],
          "switchDn": [
            {
              "dnDBID": 0,
              "cdnName": "",
              "cdnType": "",
              "cdnState": ""
            }
          ],
          "actionCode": [
            {
              "switchDBID": 0,
              "accessCode": "",
              "routeType": "",
              "targetType": ""
            }
          ]
        },
        'users' : 
          {
            "tenantDBID": 0,
            "firstName": "",
            "lastName": "",
            "employeeID": "",
            "userName": "",
            "password": "",
            "isAgent": "",
            "appType": "",
            "state": "",
            "email": "",
            "capacityRule": "",
            "placeName": "",
            "options": {},
            "appRank": [
              {
                "appType":"",
                "appRank": ""
              }
            ],
            "agentInfo": {
              "placeDBID": 0,
              "capacityRuleDBID": 0,
              "siteDBID": 0,
              "costContractDBID": 0,
              "skillsLevel": [
                {
                  "skillDBID": 0,
                  "level": 0
                }
              ],
              "agentLoginInfo": [
                {
                  "agentLoginDBID": 0,
                  "wrapupTime": 0
                }
              ]
            },
            "name": "",
            "dbid": 0
          },
          'agentlogin':[
            {
              "state": "",
              "isUseOverride": "",
              "override": "",
              "switchSpecificType": 0,
              "password": "",
              "code": "",
              "tenantDBID": 0,
              "switchDBID": 0,
              "dbid": 0,
              "name": "",
              "options":
                {}
            }
          ],

          'dn':[
            {
              "name": "",
              "type": "",
              "routeType": "",
              "switchDBID": 0,
              "state": "",
              "options": 
                {}
              ,
              "registerAll": "",
              "trunks": 0,
              "groupDBID": 0,
              "tenantDBID": 0,
              "switchSpecificType": 0,
              "useOverride": "",
              "dnLoginId": "",
              "override": "",
              "association": "",
              "alias": "",
              "number": "",
              "dbid": 0
            }
          ],

        'callinglist':[
          {
            "tenantDBID": 0,
            "name": "",
            "description": "",
            "timeFrom": 0,
            "timeUntil": 0,
            "maxAttempts": 0,
            "scriptDBID": 0,
            "state": "",
            "formatDBId": 0,
            "tableName": "",
            "dbAccessDBId": 0,
            "options": 
              {}
            ,
            "dbid": 0
          }
        ],

        'callinglistadvance':[
          {
            "dbid": 0,
            "name": "",
            "tenantDBID": 0,
            "description": "",
            "tableAccessDBID": 0,
            "logTableAccessDBID": 0,
            "timeFrom": 0,
            "timeUntil": 0,
            "scriptDBID": 0,
            "maxAttempts": 0,
            "state": "",
            "options": 
              {}
            ,
            "formatDBID": 0,
            "filterDBID": 0
          }
        ],

        'tableaccess':[
          {
            "name": "",
            "tenantDBID": 0,
            "type": "",
            "description": "",
            "dbAccessDBID": 0,
            "formatDBID": 0,
            "dbTableName": "",
            "isCachable": "",
            "state": "",
            "updateTimeout": 0,
            "options": 
              {}
            ,
            "dbid": 0
          }
        ],

        'filter':[
          {
            "name": "",
            "tenantDBID": 0,
            "description": "",
            "state": "",
            "formatDBID": 0,
            "dbid": 0,
            "options": 
              {}
            ,
            "criteria": "",
            "orderBy": ""
          }
        ],

        'calllist':[
          {
            "name": "",
            "tenantDBID": 0,
            "type": "",
            "description": "",
            "dbTableName": "",
            "dbAccessDBID": 0,
            "isCachable": "",
            "options": 
              {}
            ,
            "dbAccessName": "",
            "state": "",
            "dbid": 0
          }
        ],

        'schedules':[
          {
            "name": "",
            "tenantDBID": 0,
            "type": "",
            "state": "",
            "options": 
              {}
            ,
            "dbid": 0
          }
        ],

        'campaign':[
          {
            "name": "",
            "tenantDBID": 0,
            "description": "",
            "callingListDBID": 0,
            "state": "",
            "dbid": 0,
            "callingLists": [
              {
                "callingListDBID": 0,
                "isActive": "",
                "share": 0
              }
            ],
            "options": 
              {}
            ,
            "scriptDBID": 0
          }
        ],

        'campaigngroup':[
          {
            "campaignDBID": 0,
            "folderID": 0,
            "tenantDBID": 0,
            "groupType": "",
            "groupDBID": 0,
            "description": "",
            "dialMode": "",
            "operationMode": "",
            "optMethod": "",
            "minRecBufSize": 0,
            "maxQueueSize": 0,
            "optMethodValue": 0,
            "numOfChannels": 0,
            "optRecBuffSize": 0,
            "name": "",
            "state": "",
            "ivrProfileDBID": 0,
            "interactionQueueDBID": 0,
            "trunkGroupDNDBID": 0,
            "scriptDBID": 0,
            "dbid": 0,
            "voiceTransferDestination": 0,
            "options": 
              {}
            ,
            "numOfEngageChannels": 0
          }
        ]



        }
}