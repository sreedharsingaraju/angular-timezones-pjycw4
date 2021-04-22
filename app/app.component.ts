import { Component, Directive, Input, HostListener, Inject, Injectable, OnInit } from '@angular/core'
import { TimeZoneService } from './time-zone.service';
import moment from 'moment-timezone';
import { Moment } from 'moment';

import 'moment-range';
import 'moment/locale/fr';
import 'moment/locale/es';
import 'moment/locale/de';
import 'moment/locale/en-gb';
import 'moment/locale/ar';
import 'moment/locale/hi';

@Component({
  selector: 'app',
  template: `
  <div>
    <form #f="ngForm">
      <div class="form-group">
        <label>Select tenant/device time zone: </label>
        <select name="timeZone" [ngModel]="selectedTz" (ngModelChange)="timeZoneChanged($event)">
          <option *ngFor="let tz of tzNames" [value]="tz">
            {{ tz }}
          </option>
        </select><span> {{ tzNames.length }}</span>
      </div>
      <div class="form-group">
        <label>Select locale: </label>
        <select name="locale" [ngModel]="selectedLocale" (ngModelChange)="changeLocale($event)">
          <option *ngFor="let locale of locales" [value]="locale">
            {{ locale }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Select display time zone: </label>   
        <select name="displayTimeZone" [ngModel]="displayTz" (ngModelChange)="changeDisplayTz($event)">
          <option [value]="selectedTz">Tenant/Device</option>
          <option [value]="userTz">User</option>
          <option [value]="utcTz">UTC</option>
        </select>
      </div>
    </form>
  </div>
  <br/>
  <div>Tenant/Device time zone: <strong>{{ selectedTz }}</strong></div>
  <div>User's time zone: <strong>{{ userTz }}</strong></div>
  <br/>
  <div>UTC Date: {{ date }}</div>
  <br/>
  <div>Date displayed in: <strong>{{ displayTz }}</strong></div>
  <div>Unformated: <strong>{{ a }}</strong></div>
  <div>Formated: <strong>{{ aFormat }}</strong></div>
  <div>Date formated: <strong>{{ aDateFormat }}</strong></div>
  <div>Time formated: <strong>{{ aTimeFormat }}</strong></div>
  <div>Special format: <strong>{{ aSpecialFormat }}</strong></div>
  <br/>
  <div>
    <div *ngFor="let form of allFormats">
      {{ formats(form) }}
    </div>
 </div>
 <br/>
 <div>
   <div>Tenant from UTC: {{ tenantDateTime }}</div>
   <div>UTC from Tenant: {{ utcDateTime }}</div>
   <div>Formatted tenant from UTC: {{ tenantDateTimeFormatted }}</div>
 </div>
`
})
export class AppComponent {
  public tzNames: string[];

  public userTz: string;
  public selectedTz: string;
  public utcTz: string;
  public displayTz: string;

  public selectedLocale: string;

  public date: moment.Moment;
  public fromNow: string;

  public a: moment.Moment;
  public aFormat: string;
  public aUtcFormat: string;
  public aDateFormat: string;
  public aTimeFormat: string;
  public aSpecialFormat: string;

  public tenantDateTime: Moment;
  public tenantDateTimeFormatted: Moment;

  public utcDateTime: Moment;

  private format = 'LLL Z z';
  private dateFormat = 'L';
  private timeFormat = 'LTS';

  private allFormats = [
    'LT',  // 12:32 PM
    'LT (UTC Z)',  // 12:32 PM -08:00
    'LTS', // 12:32:18 PM
    'LTS (UTC Z)', // 12:32:18 PM -08:00
    'HH:mm:ss.SSS',
    'HH:mm:ss.SSS (UTC Z)',
    'L',   // 10/05/2018
    'LL',  // October 5, 2018
    'LLL', // October 5, 2018 12:32 PM
    'LLL (UTC Z)',  // 12:32 PM -08:00
    'LLLL',// Friday, October 5, 2018 12:32 PM
    'LLLL (UTC Z)'
  ]

  private num = 1416116057190;

  private locales = [
    'ar',
    'en',
    'en-gb',
    'fr',
    'es',
    'de',
    'hi'
  ];

  private abbrs = {
    EST: 'Eastern Standard Time',
    EDT: 'Eastern Daylight Time',
    CST: 'Central Standard Time',
    CDT: 'Central Daylight Time',
    MST: 'Mountain Standard Time',
    MDT: 'Mountain Daylight Time',
    PST: 'Pacific Standard Time',
    PDT: 'Pacific Daylight Time',
    '+0330': 'Iran'
  };

  //only for visuals
  constructor(
    @Inject('TimeZoneService') private timeZoneService: TimeZoneService
  ) {
    this.userTz = moment.tz.guess();
    this.utcTz = 'UTC'
    this.tzNames = moment.tz.names();


    this.timeZoneChanged('America/New_York');
    this.changeLocale('en');
  }

  public timeZoneChanged(timeZone: string): void {
    console.log(timeZone);
    this.selectedTz = timeZone;

    this.updateTime(timeZone);
  }

  public changeDisplayTz(displayTz: string): void {
    console.log(displayTz);
    this.updateTime(displayTz);
  }

  public changeLocale(locale: string) {
    this.selectedLocale = locale;
    moment.locale(this.selectedLocale);
    this.updateTime(this.selectedTz);
  }

  public formats(format: string): string {
    return this.a.format(format);
  }

  private updateTime(timeZone: string) {
    this.displayTz = timeZone;

    this.date = moment(this.num).utc();
    this.fromNow = this.date.fromNow();

    this.a = moment(this.num).tz(timeZone);

    this.aFormat = this.a.format(this.format); // 2013-11-18T19:55:00+08:00
    this.aDateFormat = this.a.format(this.dateFormat);
    this.aTimeFormat = this.a.format(this.timeFormat);
    this.aSpecialFormat = this.applySpecialFormat(this.a);

    this.timeZoneService.setTenantTimeZone(this.selectedTz);
    this.tenantDateTime = this.timeZoneService.utcToTenant(this.date);
    this.utcDateTime = this.timeZoneService.tenantToUtc(this.tenantDateTime);
    this.tenantDateTimeFormatted = this.timeZoneService.utcToTenantString(this.date, 'LLL');
  }

  private applySpecialFormat(dateTime: moment.Moment): string {
    let special = dateTime.format('llll');
    let offset = dateTime.utcOffset();
    return special + ' ' + dateTime.tz();
  }
}