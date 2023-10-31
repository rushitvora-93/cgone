import { tap } from 'rxjs/operators';
import { OnetestStore, SprintType, EnvType } from '../store/one-test.store';
import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class OnetestService {

    constructor(private onetestStore: OnetestStore) { }

    setPageNavigation(name) {
        this.onetestStore.update(state => {
            return {
                ...state,
                navigation: name
            }
        });
    }

    addSprint(data: SprintType) {
        this.onetestStore.update(state => {
            return {
                ...state,
                sprints: [
                    ...state.sprints,
                    data
                ]
            }
        })
    }

    loadEnv(data: any[]) {
        this.onetestStore.update(state => {
            return {
                ...state,
                environments: data
            }
        });
    }

    addEnv(data: EnvType) {
        this.onetestStore.update(state => {
            return {
                ...state,
                environments: [
                    ...state.environments,
                    data
                ]
            }
        });
    }
}