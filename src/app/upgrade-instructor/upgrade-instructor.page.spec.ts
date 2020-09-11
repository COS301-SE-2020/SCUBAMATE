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
import { map } from 'rxjs/operators';

var accessToken = "d1d7391d-c035-28ab-0193-68a7d263d4be11ac76afb3c161…0702085a1c423b0ed53f38b9a0e6e0ad8bfe8cd3712f14be7";
var validData = {
  event: "",
  center: "Reefteach",
  qualification: "Advanced Open Water Diver",
  specialization: "Wreck Diver",
  bday: "1990-03-02",
  firstN: "Harold",
  lastN: "James Potter",
  pub: false, 
  email: "harrypotter@gmail.com",
  pass: "Hermoine321!",
  cPass: "Hermoine321!",
  iNum: "9989889"
};

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
    let diveSpy = spyOn(divService, 'getDiveCenters').and.callThrough();
    expect(diveSpy).toBeDefined();
    let response = divService.getDiveCenters(validData.center).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(diveSpy).toBeDefined();
    expect(divService.getDiveCenters).toHaveBeenCalledWith(validData.center);
  });

  it('upgradeToInstructor() test', () => {
    var eventValue = {
      AccessToken: accessToken,
      InstructorNumber: "Di167-uwe",
      DiveCentre: validData.center
    };

    let accSpy = spyOn(accService, 'upgradeToInstructor').and.callThrough();
    expect(accSpy).toBeDefined();
    let response = accService.upgradeToInstructor(eventValue).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(accSpy).toBeDefined();
    expect(accService.upgradeToInstructor).toHaveBeenCalledWith(eventValue);
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
