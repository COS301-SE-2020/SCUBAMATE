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

    divService.getSingleDiveSite(center).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(center).toBe("Clifton Rock");
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
});
