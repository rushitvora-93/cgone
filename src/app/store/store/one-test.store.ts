import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';


export interface SprintType {
    channels: [
        {
            channelName: string
        }
    ],
    completedOn: string,
    sprintName: string,
    testType: string,
    status: string,
    createdOn: string,
    id: number
}

export interface SprintData {
    failedErr: number,
    agetResponsEList: [
        {
            agentName: string,
            channelList: [
                {
                    channelName: string
                }
            ],
            status: string
        }
    ],
    inProgress: 0,
    overallProgress: 0,
    totalCompleted: 0,
    totalPlannedInteraction: 0

}
export interface EnvType {
    appName: string,
    host: string,
    port: string,
    clientName: string,
    user: string,
    password: string,
}

export interface OnetestState {
    sprints: SprintType[],
    environments: EnvType[],
    navigation: string
}

export function createInitialState(): OnetestState {
    return {
        sprints: [],
        environments: [],
        navigation: null
    };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'oneTest' })
export class OnetestStore extends Store<OnetestState> {
    constructor() {
        super(createInitialState());
    }
}