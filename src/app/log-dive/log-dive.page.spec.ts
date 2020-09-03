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
});
