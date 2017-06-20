import { Injectable } from '@angular/core';
import { SampleCode } from './sample-code.model';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class DataService {
  sampleCodes: FirebaseListObservable<any[]>;

  constructor(private database: AngularFireDatabase) {
    this.sampleCodes = database.list('sampleCodes');
  }

  getSampleCodes() {
    return this.sampleCodes;
  }

}
