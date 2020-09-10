import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { DiveSiteInformationPage } from './dive-site-information.page';
import { diveService } from '../service/dive.service';
import { weatherService } from '../service/weather.service';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import {HttpModule} from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { map } from 'rxjs/operators';

describe('DiveSiteInformationPage', () => {
  let component: DiveSiteInformationPage;
  let fixture: ComponentFixture<DiveSiteInformationPage>;
  let divService: diveService;
  let weatService: weatherService;
  let http: HttpClient;
  let router; Router;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiveSiteInformationPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([]), HttpClientTestingModule, HttpModule],
      providers: [diveService, weatherService, HttpModule, Geolocation]
    }).compileComponents();

    fixture = TestBed.createComponent(DiveSiteInformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    divService = TestBed.get(diveService);
    weatService = TestBed.get(weatherService);
    router = TestBed.get(Router);
    httpMock = TestBed.get(HttpTestingController);
    http = TestBed.get(HttpClient);
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
      key: null,
      city: null,
      province: null
    };

    let weathearSpy = spyOn(weatService, 'getLocationKey').and.callThrough();
    expect(weathearSpy).toBeDefined();
    let response = weatService.getLocationKey(Key).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(weathearSpy).toBeDefined();
    expect(weatService.getLocationKey).toHaveBeenCalledWith(Key);
  });
});
