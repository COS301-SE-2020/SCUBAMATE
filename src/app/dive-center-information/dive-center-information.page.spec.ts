import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { DiveCenterInformationPage } from './dive-center-information.page';
import { diveService } from '../service/dive.service';
import { weatherService } from '../service/weather.service';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import {HttpModule} from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { map } from 'rxjs/operators';

var validData = {
  accessToken : "d1d7391d-c035-28ab-0193-68a7d263d4be11ac76afb3c161…0702085a1c423b0ed53f38b9a0e6e0ad8bfe8cd3712f14be7"
};

describe('DiveCenterInformationPage', () => {
  let component: DiveCenterInformationPage;
  let fixture: ComponentFixture<DiveCenterInformationPage>;
  let divService: diveService;
  let weatService: weatherService;
  let http: HttpClient;
  let router; Router;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiveCenterInformationPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([]), HttpClientTestingModule, HttpModule],
      providers: [diveService, weatherService, HttpModule, Geolocation]
    }).compileComponents();

    fixture = TestBed.createComponent(DiveCenterInformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    divService = TestBed.get(diveService);
    weatService = TestBed.get(weatherService);
    router = TestBed.get(Router);
    httpMock = TestBed.get(HttpTestingController);
    http = TestBed.get(HttpClient);
    localStorage.setItem("accessToken", validData.accessToken);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('getSingleDiveCenter() test', () => {
    var center = "Clifton Rock";

    let divSpy = spyOn(divService, 'getSingleDiveCenter').and.callThrough();
    expect(divSpy).toBeDefined();
    let response = divService.getSingleDiveCenter(center).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(divSpy).toBeDefined();
    expect(divService.getSingleDiveCenter).toHaveBeenCalledWith(center);
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
  
  it('Testing Dive-Center Info Components', () => {
    expect(component.Key).toBeDefined();
    expect(component.Coordinates).toBeDefined();
    expect(component.Weather).toBeDefined();
    expect(component.tempDate).toBeUndefined();
    expect(component.weatherDate).toBeUndefined();
    expect(component.Key).toBeDefined();
    expect(component.showLoading).toBeTrue();
    expect(component.loginLabel).toBe("Log Out");
    expect(component.accountType).toBeUndefined();
    expect(component.currentDiveCenter).toBeUndefined();
    expect(component.showDiveCenter).toBeDefined();
    expect(component.showWeather).toBeFalse();
  });

  it('Testing ngOnInit()', () => {
    component.ngOnInit();
    expect(component.Key).toBeDefined();
    expect(component.Coordinates).toBeDefined();
    expect(component.Weather).toBeDefined();
    expect(component.tempDate).toBeUndefined();
    expect(component.weatherDate).toBeUndefined();
    expect(component.Key).toBeDefined();
    expect(component.showLoading).toBeTrue();
    expect(component.loginLabel).toBe("Log Out");
    expect(component.accountType).toBeUndefined();
    expect(component.currentDiveCenter).toBeUndefined();
    expect(component.showDiveCenter).toBeDefined();
    expect(component.showWeather).toBeFalse();
  });

  it('Testing ionViewWillEnter()', () => {
    component.ionViewWillEnter();
    expect(component.Key).toBeDefined();
    expect(component.Coordinates).toBeDefined();
    expect(component.Weather).toBeDefined();
    expect(component.tempDate).toBeUndefined();
    expect(component.weatherDate).toBeUndefined();
    expect(component.Key).toBeDefined();
    expect(component.showLoading).toBeTrue();
    expect(component.loginLabel).toBe("Log Out");
    expect(component.accountType).toBeUndefined();
    expect(component.currentDiveCenter).toBeUndefined();
    expect(component.showDiveCenter).toBeDefined();
    expect(component.showWeather).toBeFalse();
  });

  it('Testing Dive-Center Info Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.ionViewWillEnter).toBeTruthy();
    expect(component.loginClick).toBeTruthy();
    expect(component.checkURL).toBeTruthy();
  });
});
