import { Injectable } from '@angular/core';

import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireDatabaseModule} from 'angularfire2/database';

@Injectable()
export class AuthService {

  constructor((afa: AngularFireAuth) {
  afa.auth.signInWithPopup()
  }

  loginWithGoogle() {
    this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    return this.af.auth.logout();
  }

}
