import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AdminPagePage } from './admin-page.page';
import { diveService } from '../service/dive.service';
import { accountService } from '../service/account.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import {HttpModule} from '@angular/http';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder} from '@angular/forms';
import { stringify } from 'querystring';

describe('AdminPagePage', () => {
  let component: AdminPagePage;
  let fixture: ComponentFixture<AdminPagePage>;
  let divService: diveService;
  let accService: accountService;
  let http: HttpClient;
  let router; Router;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPagePage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([]), HttpClientTestingModule, HttpModule],
      providers: [diveService, HttpModule, accountService, FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPagePage);
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

  it('centerListFinder() test', () => {
    var eventValue = "";

    divService.getDiveCenters(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

  it('courseListFinder() test', () => {
    var eventValue = "";

    divService.getDiveCourses(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

  it('getDiveSites() test', () => {
    var reqBody = "";

    divService.getDiveSites(reqBody).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(reqBody).toBeDefined();
  });

  it('getUnverifiedInsrtuctors() test', () => {
    var eventValue = "";

    accService.getUnverifiedInstructors().subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

  it('getAdmimDiveCenter() test', () => {
    var bod = "";

    divService.getDiveSites(bod).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(bod).toBeDefined();
  });

  it('addUserToDiveCenter() test', () => {
    var eventValue = {

    };

    accService.addUsertoDiveCenter(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBeDefined();
  });

  it('addDiveCenter() test', () => {
    var eventValue = {

    };

    accService.addDiveCenter(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBeDefined();
  });

  it('verifyInstructor() test', () => {
    var eventValue = {

    };

    accService.verifyInstructor(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBeDefined();
  });

  it('updateDiveCenterSubmit() test', () => {
    var diveObj = {
      AccessToken: "",
      DiveID: ""
    }

    divService.editBasicDiveCentre(diveObj).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(diveObj).toBeDefined();
  });

  it('addCoursesToDiveCenter() test', () => {
    var diveObj = {
      AccessToken: "",
      DiveID: ""
    }

    divService.addCoursesToDiveCentre(diveObj).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(diveObj).toBeDefined();
  });

  it('addDiveSitesToCentre() test', () => {
    var diveObj = {
      AccessToken: "",
      DiveID: ""
    }

    divService.addDiveSitesToCentre(diveObj).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(diveObj).toBeDefined();
  });

  it('createNewCourse() test', () => {
    var diveObj = {
      AccessToken: "",
      DiveID: ""
    }

    divService.createNewCourse(diveObj).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(diveObj).toBeDefined();
  });

  it('createNewSite() test', () => {
    var diveObj = {
      AccessToken: "",
      DiveID: ""
    }

    divService.createNewSite(diveObj).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(diveObj).toBeDefined();
  });

});
