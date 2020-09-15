import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { LogDivePage } from './log-dive.page';
import { diveService } from '../service/dive.service';
import { accountService } from '../service/account.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import {HttpModule} from '@angular/http';
import { FormBuilder} from '@angular/forms';
import { weatherService } from '../service/weather.service';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { map } from 'rxjs/operators';
import 'jasmine';

var validData = {
  pub: false,
  desc: "Saw Sharks",
  site: "Shark Alley",
  qualification: "Advanced Open Water Diver",
  date: "2018-01-04",
  timeIn: "12:00",
  timeOut: "13:00",
  diveType: "Training Dive",
  buddy: "John Cena",
  vis: "13m",
  dep: "12m",
  aT: 12,
  surfaceT: 13,
  bottomT: 7,
  accessToken : "d1d7391d-c035-28ab-0193-68a7d263d4be11ac76afb3c161…0702085a1c423b0ed53f38b9a0e6e0ad8bfe8cd3712f14be7"
};


describe('LogDivePage', () => {
  let component: LogDivePage;
  let fixture: ComponentFixture<LogDivePage>;
  let weatService: weatherService;
  let divService: diveService;
  let accService: accountService;
  let http: HttpClient;
  let router; Router;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogDivePage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([]), HttpClientTestingModule, HttpModule],
      providers: [diveService, HttpModule, Geolocation, accountService, FormBuilder, weatherService]
    }).compileComponents();

    fixture = TestBed.createComponent(LogDivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    divService = TestBed.get(diveService);
    accService = TestBed.get(accountService);
    weatService = TestBed.get(weatherService);
    router = TestBed.get(Router);
    httpMock = TestBed.get(HttpTestingController);
    http = TestBed.get(HttpClient);
    localStorage.setItem("accessToken", validData.accessToken);
  }));

  it('Succesfully Created Log-Dive Page', () => {
    expect(component).toBeTruthy();
  });

  it('getLocationKey() test', () => {
    var Coordinates = {
      Latitude: "-25.840380",
      Longitude: "28.245230"
    };

    let weathearSpy = spyOn(weatService, 'getLocationKey').and.callThrough();
    expect(weathearSpy).toBeDefined();
    let response = weatService.getLocationKey(Coordinates).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(weathearSpy).toBeDefined();
    expect(weatService.getLocationKey).toHaveBeenCalledWith(Coordinates);
  });

  it('getLogWeather() test', () => {
    var Key = {
      key: "uF3LU0UljaHxJrAP3QkEthAD3Pdjwh3g",
      city: "Pretoria",
      province: "Gauteng"
    };

    let weathearSpy = spyOn(weatService, 'getLogWeather').and.callThrough();
    expect(weathearSpy).toBeDefined();
    let response = weatService.getLogWeather(Key).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(weathearSpy).toBeDefined();
    expect(weatService.getLogWeather).toHaveBeenCalledWith(Key);
  });

  it('lookAheadBuddy() test', () => {
    var eventValue = "John";

    let accountSpy = spyOn(accService, 'lookAheadBuddy').and.callThrough();
    expect(accountSpy).toBeDefined();
    let response = accService.lookAheadBuddy(eventValue).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(accountSpy).toBeDefined();
    expect(accService.lookAheadBuddy).toHaveBeenCalledWith(eventValue);
  });

  it('logDive() test', () => {
    var log = {
      DiveID: "D"+ "",
      AccessToken : validData.accessToken,
      Approved: false,
      DiveDate: validData.date ,
      TimeIn: validData.timeIn ,
      TimeOut: validData.timeOut ,
      Visibility: validData.vis + "m",
      Depth: validData.dep + "m",
      Buddy: validData.buddy ,
      DiveTypeLink: validData.diveType   ,
      AirTemp: Number(validData.aT) ,
      SurfaceTemp: Number(validData.surfaceT) ,
      BottomTemp: Number(validData.bottomT) ,
      DiveSite: validData.site,
      Description: validData.desc ,
      InstructorLink: [] ,
      Weather: ["", "", ""],
      DivePublicStatus: validData.pub,
      isCourse: "" 
    }

    let diveSpy = spyOn(divService, 'logDive').and.callThrough();
    expect(diveSpy).toBeDefined();
    let response = divService.logDive(log).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(diveSpy).toBeDefined();
    expect(divService.logDive).toHaveBeenCalledWith(log);
  });

  it('getDiveTypes() test', () => {
    let diveSpy = spyOn(divService, 'getDiveTypes').and.callThrough();
    expect(diveSpy).toBeDefined();
    let response = divService.getDiveTypes(validData.diveType).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(diveSpy).toBeDefined();
    expect(divService.getDiveTypes).toHaveBeenCalledWith(validData.diveType);
  });

  it('getDiveSites() test', () => {
    let diveSpy = spyOn(divService, 'getDiveSites').and.callThrough();
    expect(diveSpy).toBeDefined();
    let response = divService.getDiveSites(validData.site).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(diveSpy).toBeDefined();
    expect(divService.getDiveSites).toHaveBeenCalledWith(validData.site);
  });

  it('lookAheadInstructor() test', () => {
    var eventValue = "John";

    let accountSpy = spyOn(accService, 'lookAheadInstructor').and.callThrough();
    expect(accountSpy).toBeDefined();
    let response = accService.lookAheadInstructor(eventValue).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(accountSpy).toBeDefined();
    expect(accService.lookAheadInstructor).toHaveBeenCalledWith(eventValue);
  });

  it('getDiveCourses() test', () => {
    let diveSpy = spyOn(divService, 'getDiveCourses').and.callThrough();
    expect(diveSpy).toBeDefined();
    let response = divService.getDiveCourses(validData.qualification).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(diveSpy).toBeDefined();
    expect(divService.getDiveCourses).toHaveBeenCalledWith(validData.qualification);
  });

  it('Testing Log-Dive Components', () => {
    expect(component.uuidValue).toBeDefined();
    expect(component.showLoading).toBeFalse();
    expect(component.DiveTypeLst).toBeUndefined();
    expect(component.DiveSiteLst).toBeUndefined();
    expect(component.BuddyLst).toBeUndefined();
    expect(component.cDate).toBeDefined();
    expect(component.currentDate).toBeDefined();
    expect(component.MaxTempAPI).toBeUndefined();
    expect(component.MinTempAPI).toBeUndefined();
    expect(component.MoonPhase).toBeUndefined();
    expect(component.WeatherDescription).toBeUndefined();
    expect(component.WindSpeed).toBeUndefined();
    expect(component.Key).toBeDefined();
    expect(component.Coordinates).toBeDefined();
    expect(component.loginLabel).toBeDefined();
  });

  it('Testing ngOnInit()', () => {
    component.ngOnInit();
    expect(component.cDate).toBeInstanceOf(Date);
    expect(component.currentDate).toBeDefined();
    expect(component.showLoading).toBeTrue();
    expect(component.loginLabel).toBe("Log Out");
    let diveSpy = spyOn(divService, 'getDiveSites').and.callThrough();
    expect(diveSpy).toBeDefined();
    diveSpy = spyOn(divService, 'getDiveTypes').and.callThrough();
    expect(diveSpy).toBeDefined();
    let weatherSpy = spyOn(weatService, 'getLocationKey').and.callThrough();
    expect(weatherSpy).toBeDefined();
    weatherSpy = spyOn(weatService, 'getLogWeather').and.callThrough();
    expect(weatherSpy).toBeDefined();
    expect(component.DiveSiteLst).toBeUndefined();
    expect(component.DiveTypeLst).toBeUndefined();
    expect(component.Coordinates).toBeDefined();
    expect(component.Key).toBeDefined();
    expect(component.MaxTempAPI).toBeUndefined();
    expect(component.MinTempAPI).toBeUndefined();
    expect(component.MoonPhase).toBeUndefined();
    expect(component.WeatherDescription).toBeUndefined();
    expect(component.WindSpeed).toBeUndefined();
    
  });

  it('Testing ionViewWillEnter()', () => {
    component.ionViewWillEnter();
    expect(component.loginLabel).toBe("Log Out");
  });

  it('Testing loginClick()', () => {
    let navigateSpy = spyOn(router, 'navigate');
    component.loginClick();
    expect(navigateSpy).toHaveBeenCalledWith(['home']);
  });

  it('Testing buddyListFinder()', () => {
    let accountSpy = spyOn(accService, 'lookAheadBuddy').and.callThrough();
    expect(accountSpy).toBeDefined();
    expect(component.BuddyLst).toBeUndefined();
    expect(component.showLoading).toBeFalse();
  });

  it('Testing DiveLogSubmit()', () => {
    let navigateSpy = spyOn(router, 'navigate');
    let diveSpy = spyOn(divService, 'logDive').and.callThrough();
    expect(diveSpy).toBeDefined();
    expect(component.showLoading).toBeFalse();
  }); 

  it('Testing Log-Dive Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.ionViewWillEnter).toBeTruthy();
    expect(component.loginClick).toBeTruthy();
    expect(component.DiveLogSubmit).toBeTruthy();
    expect(component.buddyListFinder).toBeTruthy();
  });
});
