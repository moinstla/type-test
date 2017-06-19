import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from "@angular/router";

import {AngularFireModule} from "angularfire2";

import { AppComponent } from './app.component';
import { AuthService } from './providers/auth.service';
import { LogInComponent } from './log-in/log-in.component';
import { WelcomeComponent } from './welcome/welcome.component';

export const firebaseConfig = {
  apiKey: "AIzaSyBRRH4wVXpbKRXfot4Qrvt21Olxvu_QKwE",
  authDomain: "type-test-33c14.firebaseapp.com",
  databaseURL: "https://type-test-33c14.firebaseio.com",
  storageBucket: "type-test-33c14.appspot.com",
  messagingSenderId: "826920843551"
}

const routes: Routes = [

  {
    path: '',
    component: WelcomeComponent
  },
  {
    path: 'login',
    component: LogInComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    RouterModule.forRoot(routes)
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
