import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { EditDivePage } from './edit-dive.page';
import { diveService } from '../service/dive.service';
import { accountService } from '../service/account.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import {HttpModule} from '@angular/http';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder} from '@angular/forms';
import { map } from 'rxjs/operators';

var reqBody = {
  AccessToken : "d1d7391d-c035-28ab-0193-68a7d263d4be11018bb4bb890ede82397fea8e38e8cb3b5646f4053ff8c04aec7048b8c3d4376e",
  DiveID : "Dda76ff1c-fc3b-3611-1341-e946a674de6f"
};

describe('EditDivePage', () => {
  let component: EditDivePage;
  let fixture: ComponentFixture<EditDivePage>;
  let divService: diveService;
  let accService: accountService;
  let http: HttpClient;
  let router; Router;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDivePage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([]), HttpClientTestingModule, HttpModule],
      providers: [diveService, HttpModule, accountService, FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(EditDivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    divService = TestBed.get(diveService);
    accService = TestBed.get(accountService);
    router = TestBed.get(Router);
    httpMock = TestBed.get(HttpTestingController);
    http = TestBed.get(HttpClient);
    localStorage.setItem("accessToken", reqBody.AccessToken);
    localStorage.setItem("DiveID", reqBody.DiveID);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updateDive() test', () => {
    var req = {
      DiveID: reqBody.DiveID,
      AccessToken: reqBody.AccessToken,
      Buddy: "John Cena",
      InstructorLink: "-",
      Description: "Mellow Drifting Dive",
      DivePublicStatus: true
    };

    let editDiveSpy = spyOn(divService, 'updateDive').and.callThrough();
    expect(editDiveSpy).toBeDefined();
    let response = divService.updateDive(req).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(editDiveSpy).toBeDefined();
    expect(divService.updateDive).toHaveBeenCalledWith(req);
  });

  it('lookAheadBuddy() test', () => {
    var eventValue = "John";

    let accountSpy = spyOn(accService, 'lookAheadBuddy').and.callThrough();
    expect(accountSpy).toBeDefined();
    let response = accService.lookAheadBuddy(eventValue).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(accountSpy).toBeDefined();
    expect(accService.lookAheadBuddy).toHaveBeenCalledWith(eventValue);
  });

  it('getIndividualDive() test', () => {
    var req = {
      AccessToken: reqBody.AccessToken,
      DiveID: reqBody.DiveID
    }

    let editDiveSpy = spyOn(divService, 'getIndividualDive').and.callThrough();
    expect(editDiveSpy).toBeDefined();
    let response = divService.getIndividualDive(req).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(editDiveSpy).toBeDefined();
    expect(divService.getIndividualDive).toHaveBeenCalledWith(req);
  });

  it('Testing Edit-Dive Component', () => {
    expect(component.showLoading).toBeTrue();
    expect(component.showUser).toBeFalse();
    expect(component.DiveTypeLst).toBeUndefined();
    expect(component.DiveSiteLst).toBeUndefined();
    expect(component.BuddyLst).toBeUndefined();
    expect(component.loginLabel).toBeDefined();
    expect(component.CurrentDive).toBeUndefined();
    expect(component.diveForm).toBeDefined();
    expect(component.diveObj).toBeDefined();
  });

  it('Testing ngOnInit()', () => {
    component.ngOnInit();
    expect(component.showLoading).toBeTrue();
    expect(component.loginLabel).toBe("Log Out");
  });

  it('Testing ionViewWillEnter()', () => {
    component.ionViewWillEnter();
    expect(component.loginLabel).toBe("Log Out");
  });

  it('Testing loginClick()', () => {
    let navigateSpy = spyOn(router, 'navigate');
    component.loginClick();
    expect(navigateSpy).toHaveBeenCalledWith(['home']);
  });

  it('Testing UpdateDiveSubmit()', () => {
    let navigateSpy = spyOn(router, 'navigate');
    component.UpdateDiveSubmit();
    expect(component.showLoading).toBeTrue();
  });

  it('Testing buddyListFinder()', () => {
    component.buddyListFinder("John");
    expect(component.showLoading).toBeTrue();
  });

  it('Testing getDiveInfo()', () => {
    component.getDiveInfo();
  });

  it('Testing Edit-Dive Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.ionViewWillEnter).toBeTruthy();
    expect(component.loginClick).toBeTruthy();
    expect(component.onSubmit).toBeTruthy();
    expect(component.buddyListFinder).toBeTruthy();
    expect(component.getDiveInfo).toBeTruthy();
  });
});
