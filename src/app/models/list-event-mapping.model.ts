export class ListEventMapping {
    public static ListEventType: any = {
        'places': {
            'capacityRuleDBID': {
                'api': 'list/{sessionId}/capacityscript',
                'mappedKeyName': "dbid",
                "propertyName": "name",
                "result": []
            },
            'costContractDBID': {
                'api': 'list/{sessionId}/costcontractobjectivetable',
                'mappedKeyName': "dbid",
                "propertyName": "name",
                "result": []
            },
            'dn': {
                'api': 'list/{sessionId}/dn/{switchid}',
                'mappedKeyName': "dbid",
                "propertyName": "name",
                "result": []
            },
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },

        },
        'placegroups': {
            'capacityTableDBID': {
                'api': 'list/{sessionId}/capacitytable',
                'mappedKeyName': "dbid",
                "propertyName": "name",
                "result": []
            },
            'costContractDBID': {
                'api': 'list/{sessionId}/costcontractobjectivetable',
                'mappedKeyName': "dbid",
                "propertyName": "name",
                "result": []
            },
            'quotaTableDBID': {
                'api': 'list/{sessionId}/quotatable',
                'mappedKeyName': "dbid",
                "propertyName": "name",
                "result": []
            },
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
           'placeGroupDn':{
            'api': 'list/{sessionId}/orignatingdn/{switchid}',
            "result": [],
            'mappedKeyName': "dbid",
            "propertyName": "name",
           }
        },
        'switches': {      
            'tServerID': {
                'api': 'allapps/{sessionId}/alltserverapp',
                'mappedKeyName': 'dbid',
                "propertyName": "name",
                "result": []
            },
            'switchAccessCode': {
                'api': '{switchid}', // so that unable to call the api inside the object-detail
                'mappedKeyName': 'empty',
                // "propertyName": "appName", 
                "result": []
            },
            'defaultAccessCode': {
                'api': '{switchid}', //switchingoffice/{sessionId}
                'mappedKeyName': 'empty', //appId
             //   "propertyName": "appName",
                "result": []
            },
            'phySwitchID' : {
                'api': 'list/{sessionId}/switchingoffice',
                'mappedKeyName': 'dbid',
                "propertyName": "name",
                "result": []
            },
            'agentLogin' : {
                'api' : 'agentlogin/{sessionId}/getall/{switchid}',
                'result' : [],
                'mappedKeyName': 'appId',
                "propertyName": "appName",
            },
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
            //  'switchAccessCode[0].targetType': 'list/alltargettype', // need to discuss it with pawan
            // 'switchAccessCode[0].routeType': 'list/allroutetype', // need to discuss it with pawan
        },
        'scripts': {
            'type': {
                'api': 'list/allscripttype',
                "propertyName": "type",
                "result": []
            },
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
        },
        'transaction': {
            'type': {
                'api': 'list/alltransactiontype',
                "result": []
            },
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
        },
        'businessattribute': {
            'type': {
                'api': 'list/allbatype',
                "result": []
            },
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
        },
        'codes': {
            'type': {
                'api': 'list/allactioncodetype',
                "result": []
            },
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
            'subcodes' : {
                'api' : '{switchid}', // enter only switchid so that it couldn't able to call api in the Object-detail 
                'result' : [],
                'mappedKeyName' : 'empty' ,// so that user can only increment empty fields
                "propertyName": "subcodes",
            }
        },
        'objectivetable': {
            'type': {
                'api': 'list/allobjectivetype',
                "result": []
            },
            'objectiveRecords': {
                'api': '{switchid}',
                "result": [],
                "mappedKeyName" : ''
            },
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
            'timeZoneDBID' : {
                'api' : 'list/{sessionId}/getalltimezone',
                'result' : [],
                'mappedKeyName': "dbid",
                "propertyName": "name",

            },
            'contractStartTime' : {
                'api' : 'calendar/{switchid}', // set word calendar to show calendar
                'result' : []
            },
            'contractEndTime' : {
                'api' : 'calendar/{switchid}', // set word calendar to show calendar
                'result' : []
            }
        },
        'solutions': {
            'solutionType': {
                'api': 'list/allsolutiontype',
                "result": []
            },
            'solutionComponent': {
                'api': 'allapps/{sessionId}',
                'mappedKeyName': 'appId',
                "propertyName": "appName",
                "result": []
            },
            'componentDef': {
                'api': 'list/allapptype',
                'mappedKeyName': 'mappedKeyName',
                "propertyName": "propertyName",
                "result": []
            },
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
            'scsDBID' : {
                'api': 'allapps/{sessionId}/allscsapp',
                'mappedKeyName': 'appId',
                "propertyName": "appName",
                "result": []   
            }
        },
        'timezone': {
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
            'timeZone':{
                'api': 'list/gettimezoneoffset',
                "result": [],
                'mappedKeyName': "mappedName",
                "propertyName": "propertyName",
            },
            
        },
        'statisticaldays': {
            'type': {
                'api': 'list/allstatdaytype',
                "result": []
            },
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
            'intervals' : {
                'api' : '{switchid}', // enter only switchid so that it couldn't able to call api in the Object-detail 
                'result' : [],
                'mappedKeyName' : 'empty' ,// so that user can only increment empty fields
                "propertyName": "intervals",
            }
        },
        'users': {
            'appRank': {
                'api': 'list/allapprank',
                "result": [],
                "mappedKeyName" : ''
                // 'propertyName' : ''
            },
            'appType': {
                'api': 'list/allapplicationtype',
                "result": []
            },
            'placeName': {
                'api': 'places/{sessionId}',
                "result": []
            },
            'capacityRule': {
                'api': 'list/{sessionId}/capacityscript',
                "result": []
            },
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
            'skillsLevel' : {
                'api' : '{switchid}'
            },
            'agentInfo' : {
                 'api' : '{switchid}',
                 'mappedKeyName' : "empty"
                // 'result' : [],
                // 'child' : {}
            }
        },
        'agentgroup': {
            'capacityTableDBID': {
                'api': 'list/{sessionId}/capacitytable',
                'mappedKeyName': "dbid",
                "propertyName": "name",
                "result": []
            },
            'quotaTableDBID': {
                'api': 'list/{sessionId}/quotatable',
                'mappedKeyName': "dbid",
                "propertyName": "name",
                "result": []
            },
            'supervisors': {
                'api': 'users/{sessionId}',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
            'originationDN': {
                'api': 'dn/{sessionId}/getall/{switchid}',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
            'costContractDBID': {
                'api': 'list/{sessionId}/costcontractobjectivetable',
                'mappedKeyName': "dbid",
                "propertyName": "name",
                "result": []
            },
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
        },
        'routingscript' : {
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
        },
        'skills' : {
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
        },
        'accessgroup' : {
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
        },
        'campaign':{
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
        },
        'callinglist':{
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
        },
        'tableaccess':{
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
        },
        'formats':{
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
        },
        'fields':{
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
        },
        'filter':{
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
        },
        'requestlog':{
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
        },
        'calllist':{
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
        },
        'schedules':{
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
        },
        'interactionqueue':{
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
        },
        'agentlogin':{
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
        },
        'dn':{
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
        },
        'roles':{
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
        },
        'orchestration':{
            'tenantDBID':{
                'api': 'list/{sessionId}/tenants',
                "result": [],
                'mappedKeyName': "dbid",
                "propertyName": "name",
            },
            'type': {
                'api': 'list/allscripttype',
                "propertyName": "type",
                "result": []
            },
        },
        
        
    }
}