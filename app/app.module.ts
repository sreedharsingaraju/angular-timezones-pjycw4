import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TimeZoneService } from './time-zone.service'

const imports = [
  BrowserModule,
  FormsModule
]
const bootstrap = [AppComponent]
const declarations = [
    AppComponent
]
const providers = [
    {provide: 'TimeZoneService', useClass: TimeZoneService }
]

@NgModule({
    imports,
    declarations,
    bootstrap,
    providers
})
export class AppModule {}
