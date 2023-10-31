export class ListHeirarchyEvents {
    public static HeirarchyEvents : any = {
            'switchAccessCode' :
            {
                'switchDBID' : 
                {
                    'api' : 'list/{sessionId}/getallswitch',
                    'sequence' : 'item1'
                },
                'routeType' :{
                    'api' : 'list/allroutetype',
                    'sequence' : 'item2'
                } ,
                'targetType' : {
                    'api' : 'list/alltargettype',
                    'sequence' : 'item3'
                },
                // 'accessCode' : ''
            },
            'defaultAccessCode' : {
                'switchDBID' : 
                {
                    'api' : 'list/{sessionId}/getallswitch',
                    'sequence' : 'item1'
                },
                'routeType' : {
                    'api' : 'list/allroutetype',
                    'sequence' : 'item2'},
                'targetType' : {
                    'api' : 'list/alltargettype',
                    'sequence' : 'item3'
                }
            } 
    }
}