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

var validData = {
  pub: false,
  desc: "Saw Sharks",
  site: "Shark Alley",
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

    weatService.getLocationKey(Coordinates).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(Coordinates.Latitude).toBe("-25.840380");
    expect(Coordinates.Longitude).toBe("28.245230");
  });

  it('getLogWeather() test', () => {
    
    var Key = {
      key: null,
      city: null,
      province: null
    };

    weatService.getLogWeather(Key).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(Key.key).toBeNull();
    expect(Key.city).toBeNull();
    expect(Key.province).toBeNull();
  });

  it('lookAheadBuddy() test', () => {
    var eventValue = "";

    accService.lookAheadBuddy(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

  it('logDive() test', () => {
    var eventValue = {

    };

    divService.logDive(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBeDefined();
  });

  it('getDiveTypes() test', () => {
    var eventValue = "";

    divService.getDiveTypes(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

  it('getDiveSites() test', () => {
    var eventValue = "";

    divService.getDiveSites(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

  it('lookAheadInstructor() test', () => {
    var eventValue = "";

    accService.lookAheadInstructor(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

  it('getDiveCourses() test', () => {
    var eventValue = "";

    divService.getDiveCourses(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

  it('Testing Log-Dive Components', () => {
    expect(component.uuidValue).toBeDefined();
    expect(component.showLoading).toBeTrue();
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
    expect(component.showLoading).toBeTrue();
  });

  it('Testing DiveLogSubmit()', () => {
    let navigateSpy = spyOn(router, 'navigate');
    let diveSpy = spyOn(divService, 'logDive').and.callThrough();
    expect(diveSpy).toBeDefined();
    expect(component.showLoading).toBeTrue();
  }); 

  it('Testing Log-Dive Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.ionViewWillEnter).toBeTruthy();
    expect(component.loginClick).toBeTruthy();
    expect(component.DiveLogSubmit).toBeTruthy();
    expect(component.buddyListFinder).toBeTruthy();
  });
});
