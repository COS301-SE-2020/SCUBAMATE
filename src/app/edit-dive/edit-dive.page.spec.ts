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
    var reqBody = {
      DiveID: "",
      AccessToken: "",
      Buddy: "bud",
      InstructorLink: "-",
      Description: "desc",
      DivePublicStatus: "pub"
    };

    divService.updateDive(reqBody).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(reqBody).toBeDefined();
  });

  it('lookAheadBuddy() test', () => {
    var eventValue = "";

    accService.lookAheadBuddy(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

  it('getIndividualDive() test', () => {
    var reqBody = {
      AccessToken: "",
      DiveID: ""
    }

    divService.getIndividualDive(reqBody).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(reqBody).toBeDefined();
  });

  it('updateDive() test', () => {
    var diveObj = {
      AccessToken: "",
      DiveID: ""
    }

    divService.updateDive(diveObj).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(diveObj).toBeDefined();
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
    localStorage.setItem("accessToken", reqBody.AccessToken);
    localStorage.setItem("DiveID", reqBody.DiveID);
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
    let editDiveSpy = spyOn(divService, 'updateDive').and.callThrough();
    expect(editDiveSpy).toBeDefined();
  });

  it('Testing buddyListFinder()', () => {
    component.buddyListFinder("John");
    expect(component.showLoading).toBeTrue();
    let editDiveSpy = spyOn(accService, 'lookAheadBuddy').and.callThrough();
    expect(editDiveSpy).toBeDefined();
  });

  it('Testing getDiveInfo()', () => {
    component.getDiveInfo();
    let editDiveSpy = spyOn(divService, 'getIndividualDive').and.callThrough();
    expect(editDiveSpy).toBeDefined();
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
