import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { WeatherPage } from './weather.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { weatherService } from '../service/weather.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import {HttpModule} from '@angular/http';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder} from '@angular/forms';

var accessToken = "d1d7391d-c035-28ab-0193-68a7d263d4be11ac76afb3c161…0702085a1c423b0ed53f38b9a0e6e0ad8bfe8cd3712f14be7";

describe('WeatherPage', () => {
  let component: WeatherPage;
  let fixture: ComponentFixture<WeatherPage>;
  let weatService: weatherService;
  let http: HttpClient;
  let router; Router;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeatherPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([]), HttpClientTestingModule, HttpModule],
      providers: [weatherService, HttpModule, WeatherPage, FormBuilder, Geolocation]
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    weatService = TestBed.get(weatherService);
    router = TestBed.get(Router);
    httpMock = TestBed.get(HttpTestingController);
    http = TestBed.get(HttpClient);
  }));

  it('Successfully Created Weather Page', () => {
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

  it('Testing Weather Components', () => {
    expect(component.Coordinates).toBeDefined();
    expect(component.Key).toBeDefined();
    expect(component.Weather).toBeDefined();
    expect(component.tempDate).toBeUndefined();
    expect(component.weatherDate).toBeUndefined();
    expect(component.loginLabel).toBeDefined();
  });

  it('Testing ngOnInit()', () => {
    localStorage.setItem("accessToken", accessToken);
    component.ngOnInit();
    expect(component.loginLabel).toBe("Log Out");
    let weatherSpy = spyOn(weatService, 'getLocationKey').and.callThrough();
    expect(weatherSpy).toBeDefined();
    weatherSpy = spyOn(weatService, 'getLogWeather').and.callThrough();
    expect(weatherSpy).toBeDefined();
    expect(component.Coordinates).toBeDefined();
    expect(component.Key).toBeDefined();
    expect(component.Weather).toBeDefined();
    expect(component.tempDate).toBeUndefined();
    expect(component.weatherDate).toBeUndefined();
  });

  it('Testing ionViewWillEnter()', () => {
    localStorage.setItem("accessToken", accessToken);
    component.ionViewWillEnter();
    expect(component.loginLabel).toBe("Log Out");
  });

  it('Testing loginClick()', () => {
    localStorage.setItem("accessToken", accessToken);
    let navigateSpy = spyOn(router, 'navigate');
    component.loginClick();
    expect(navigateSpy).toHaveBeenCalledWith(['']);
  });

  it('Testing Weather Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.ionViewWillEnter).toBeTruthy();
    expect(component.loginClick).toBeTruthy();
  });
});
