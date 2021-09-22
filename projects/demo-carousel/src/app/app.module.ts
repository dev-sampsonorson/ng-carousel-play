import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UiLibModule } from 'projects/ui-lib/src/public-api'

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    UiLibModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
