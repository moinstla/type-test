import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from './app.routing';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { TypingTestComponent } from './typing-test/typing-test.component';
import { CheckTextPipe } from './check-text.pipe';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    TypingTestComponent,
    CheckTextPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
