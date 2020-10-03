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
import { map } from 'rxjs/operators';

var accessToken = "d1d7391d-c035-28ab-0193-68a7d263d4be11ac76afb3c161…0702085a1c423b0ed53f38b9a0e6e0ad8bfe8cd3712f14be7";

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
    localStorage.setItem("accessToken", accessToken);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getPublicDives() test', () => {
    var temp: number;
    temp = 2;
    let editDiveSpy = spyOn(divService, 'getPublicDives').and.callThrough();
    expect(editDiveSpy).toBeDefined();
    let response = divService.getPublicDives(temp).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(editDiveSpy).toBeDefined();
    expect(divService.getPublicDives).toHaveBeenCalled();
  });

  it('getExtendedDiveCenters() test', () => {
    var eventValue = "*";
    var digit: number;
    digit = 1;
    let editDiveSpy = spyOn(divService, 'getExtendedDiveCenters').and.callThrough();
    expect(editDiveSpy).toBeDefined();
    let response = divService.getExtendedDiveCenters(eventValue, digit).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(editDiveSpy).toBeDefined();
    expect(divService.getExtendedDiveCenters).toHaveBeenCalledWith(eventValue, digit);
  });

  it('Testing Explore Components', () => {
    expect(component.siteLst).toBeDefined();
    expect(component.centerLst).toBeDefined();
    expect(component.showSites).toBeUndefined();
    expect(component.showCenters).toBeUndefined();
    expect(component.showFeed).toBeUndefined();
    expect(component.showLoading).toBeUndefined();
    expect(component.pubLst).toBeDefined();
    //expect(component.loginLabel).toBe("Log Out");
  });

  it('Testing Explore Functionlity', () => {
    expect(component.ngOnInit).toBeDefined();
    expect(component.ionViewWillEnter).toBeDefined();
    expect(component.loginClick).toBeDefined();
    expect(component.displayDiveSites).toBeDefined();
    expect(component.displayDiveCenters).toBeDefined();
    expect(component.displayFeed).toBeDefined();
  });

  it('Testing ngOnInit()', () => {
    component.ngOnInit();
    expect(component.showFeed).toBeUndefined();
    expect(component.showSites).toBeUndefined();
    expect(component.showCenters).toBeUndefined();
    expect(component.loginLabel).toBe("Log Out");
    expect(component.pubLst).toBeDefined();
    expect(component.showLoading).toBeUndefined();
    let diveSpy = spyOn(divService, 'getPublicDives').and.callThrough();
    expect(diveSpy).toBeDefined();
  });

  it('Testing ionViewWillEnter', () => {
    component.ngOnInit();
    expect(component.showFeed).toBeUndefined();
    expect(component.showSites).toBeUndefined();
    expect(component.showCenters).toBeUndefined();
    expect(component.loginLabel).toBe("Log Out");
    expect(component.pubLst).toBeDefined();
    expect(component.showLoading).toBeUndefined();
    let diveSpy = spyOn(divService, 'getPublicDives').and.callThrough();
    expect(diveSpy).toBeDefined();
  });

  it('Testing displayDiveSites', () => {
    component.displayDiveSites();
    expect(component.showFeed).toBeFalse();
    expect(component.showSites).toBeTrue();
    expect(component.showCenters).toBeFalse();
    let diveSpy = spyOn(divService, 'getDiveSites').and.callThrough();
    expect(diveSpy).toBeDefined();
    expect(component.showLoading).toBeTrue();
  });

  it('Testing displayDiveCenters', () => {
    component.displayDiveSites();
    expect(component.showFeed).toBeFalse();
    expect(component.showSites).toBeTrue();
    expect(component.showCenters).toBeFalse();
    let diveSpy = spyOn(divService, 'getDiveCenters').and.callThrough();
    expect(diveSpy).toBeDefined();
    expect(component.showLoading).toBeTrue();
  });

  it('Testing displayFeed', () => {
    component.displayFeed();
    expect(component.showFeed).toBeTrue();
    expect(component.showSites).toBeFalse();
    expect(component.showCenters).toBeFalse();
  });

});
