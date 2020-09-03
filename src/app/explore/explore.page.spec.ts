import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { ExplorePage } from './explore.page';
import { diveService } from '../service/dive.service';
import { accountService } from '../service/account.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import {HttpModule} from '@angular/http';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder} from '@angular/forms';

describe('ExplorePage', () => {
  let component: ExplorePage;
  let fixture: ComponentFixture<ExplorePage>;
  let divService: diveService;
  let accService: accountService;
  let http: HttpClient;
  let router; Router;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplorePage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([]), HttpClientTestingModule, HttpModule],
      providers: [diveService, HttpModule, accountService, FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(ExplorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    divService = TestBed.get(diveService);
    accService = TestBed.get(accountService);
    router = TestBed.get(Router);
    httpMock = TestBed.get(HttpTestingController);
    http = TestBed.get(HttpClient);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getPublicDives() test', () => {
    var eventValue = "";

    divService.getPublicDives().subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

  it('getExtendedDiveCenters() test', () => {
    var eventValue = "";

    divService.getDiveCenters(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

});
