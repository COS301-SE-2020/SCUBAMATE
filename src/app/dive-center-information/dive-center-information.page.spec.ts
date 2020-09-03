import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { DiveCenterInformationPage } from './dive-center-information.page';
import { accountService } from '../service/account.service';
import { diveService } from '../service/dive.service';
import { weatherService } from '../service/weather.service';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '../app.module';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import {HttpModule} from '@angular/http';
import { Key } from 'protractor';

var validData = {
  accessToken : "d1d7391d-c035-28ab-0193-68a7d263d4be11ac76afb3c161…0702085a1c423b0ed53f38b9a0e6e0ad8bfe8cd3712f14be7"
};

fdescribe('DiveCenterInformationPage', () => {
  let component: DiveCenterInformationPage;
  let fixture: ComponentFixture<DiveCenterInformationPage>;
  let accService: accountService;
  let divService: diveService;
  let weatService: weatherService;
  let http: HttpClient;
  let router; Router;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiveCenterInformationPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([]), AppModule, HttpClientTestingModule, HttpModule],
      providers: [accountService, diveService, weatherService, HttpModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DiveCenterInformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    localStorage.setItem("accessToken", validData.accessToken);
    accService = new accountService(http, router);
    divService = new diveService(http, router);
    weatService = TestBed.get(weatherService);
    router = TestBed.get(Router);
    httpMock = TestBed.get(HttpTestingController);
    http = TestBed.get(HttpClient);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  fit('getLocationKey() test', () => {
    var coords = {
      Latitude: "-25.840380",
      Longtitude: "28.245230"
    }

    var tempKey;

    weatService.getLocationKey(coords).subscribe((resp : any) => {
      tempKey = resp.Key;
      console.log(tempKey);
    });

    expect(coords.Latitude).toBe("-25.840380");
  });
});
