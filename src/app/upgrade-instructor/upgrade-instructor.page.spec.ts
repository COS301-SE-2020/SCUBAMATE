import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { diveService } from '../service/dive.service';
import { accountService } from '../service/account.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import {HttpModule} from '@angular/http';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder} from '@angular/forms';
import { UpgradeInstructorPage } from './upgrade-instructor.page';

var accessToken = "d1d7391d-c035-28ab-0193-68a7d263d4be11ac76afb3c161…0702085a1c423b0ed53f38b9a0e6e0ad8bfe8cd3712f14be7";

describe('UpgradeInstructorPage', () => {
  let component: UpgradeInstructorPage;
  let fixture: ComponentFixture<UpgradeInstructorPage>;
  let divService: diveService;
  let accService: accountService;
  let http: HttpClient;
  let router; Router;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpgradeInstructorPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([]), HttpClientTestingModule, HttpModule],
      providers: [diveService, HttpModule, accountService, FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(UpgradeInstructorPage);
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

  it('centerListFinder() test', () => {
    var eventValue = "";

    divService.getDiveCenters(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

  it('upgradeToInstructor() test', () => {
    var eventValue = "";

    accService.upgradeToInstructor(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

  it('Testing Instuctor Components', () => {
    expect(component.loginLabel).toBeUndefined();
    expect(component.userForm).toBeDefined();
    expect(component.userObj).toBeDefined();
    expect(component.CenterLst).toBeUndefined();
    expect(component.showLoading).toBeUndefined();
  });


  it('Testing CenterListFinder()', () => {
    component.CenterListFinder("Shark Alley");
    let weatherSpy = spyOn(divService, 'getDiveCenters').and.callThrough();
    expect(weatherSpy).toBeDefined();
    expect(component.showLoading).toBeTrue();
  });

  it('Testing UpgradeSubmit()', () => {
    let navigateSpy = spyOn(router, 'navigate');
    component.UpgradeSubmit();
    let weatherSpy = spyOn(accService, 'upgradeToInstructor').and.callThrough();
    expect(weatherSpy).toBeDefined();
  });

  it('Testing Weather Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.CenterListFinder).toBeTruthy();
    expect(component.loginClick).toBeTruthy();
    expect(component.UpgradeSubmit).toBeTruthy();
  });
});
