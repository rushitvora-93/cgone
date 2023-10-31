import { Query } from '@datorama/akita';
import { OnetestState, OnetestStore } from '../store/one-test.store';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OneCGQuery extends Query<OnetestState> {
  constructor(protected store: OnetestStore) {
    super(store);
  }

  currentNavigation() {
    return this.select(state => {
      return state.navigation;
    })
  }

  AllSprints() {
    return this.select(state => {
      return state.sprints;
    })
  }

  AllEnvironments() {
    return this.select(state => {
      return state.environments;
    })
  }
}