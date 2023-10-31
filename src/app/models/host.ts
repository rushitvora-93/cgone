export class Host {

    public status: number;
    public hostName: string;
    public hostId: number;
    public ip: string;
    public osType: string;
    public version: string;
    public lcaRunning: boolean;
    public automatorAgentRunning: boolean;
    public lcaPort: string;
    public solutionControlCenter: string;
    public startUpflag: boolean;
    public startUpFlag?: boolean;
    public state: boolean;
    public selected: boolean;
    public username?:string;
    public password?:string;
    constructor(
    ) {  }
}
