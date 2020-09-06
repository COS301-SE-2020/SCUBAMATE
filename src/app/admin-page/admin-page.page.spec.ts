import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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
      imports: [ RouterTestingModule.withRoutes([]), HttpClientTestingModule, HttpModule],
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
    var eventValue = "John";

    accService.lookAheadBuddy(eventValue).subscribe((resp) => {
      console.log(resp);
    });

    expect(eventValue).toBe("John");
  });

  it('centerListFinder() test', () => {
    var eventValue = "Reef";

    divService.getDiveCenters(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("Reef");
  });

  it('courseListFinder() test', () => {
    var eventValue = "Night";

    divService.getDiveCourses(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("Night");
  });

  it('getDiveSites() test', () => {
    var reqBody = "Reef";

    divService.getDiveSites(reqBody).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(reqBody).toBe("Reef");
  });

  it('getUnverifiedInsrtuctors() test', fakeAsync(() => {
    let response = null;
    console.log("Getting ready to call getUnverifiedInstructors()...")
    accService.getUnverifiedInstructors().subscribe(
      (resp: any) => {
        response = resp;
        console.log(response);
        console.log('Calling api')
      },
      (error: any) => {
        console.error();
      }
    );
    console.log("Done calling")
    tick();
    expect(response).toBeDefined();
  }));

  it('getUnverifiedInsrtuctors() test', () => {
    var eventValue = "";

    accService.getUnverifiedInstructors().subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

  it('getAdmimDiveCenter() test', () => {
    var bod = {
      AccessToken: "d1d7391d-c035-28ab-0193-68a7d263d4be119b81fe6d1062ae1debb83521e940bcad6efea2c0c42c0e5224745a2078835b3b"
    };

    divService.getAdminDiveCenter(bod).subscribe((resp : any) => {
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
      AccountVerified: true,
      AccessToken: "d1d7391d-c035-28ab-0193-68a7d263d4be119b81fe6d1062ae1debb83521e940bcad6efea2c0c42c0e5224745a2078835b3b",
      AccountGuid: "d1d7391d-c035-28ab-0193-68a7d263d4be"
    };

    accService.verifyInstructor(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBeDefined();
  });

  it('updateDiveCenterSubmit() test', () => {
    var body ={
      "AccessToken" : "" ,
      "Name" : "" ,
      "Coords": "" , 
      "Description": "",
      "LogoPhoto" :  ""
    };

    divService.editBasicDiveCentre(body).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(body).toBeDefined();
  });

  it('addCoursesToDiveCenter() test', () => {
    var body ={
      "AccessToken" : "" ,
      "Name" : "" ,
      "Courses": ""
    }

    divService.addCoursesToDiveCentre(body).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(body).toBeDefined();
  });

  it('addDiveSitesToCentre() test', () => {
    var body ={
      "AccessToken" : "" ,
      "Name" : "" ,
      "DiveSites": ""
    }

    divService.addDiveSitesToCentre(body).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(body).toBeDefined();
  });

  it('createNewCourse() test', () => {
    var body = {
      "AccessToken" : "" ,
      "Name": "" , 
      "CourseType": "" ,
      "MinAgeRequired": "" ,
      "SurveyAnswer": "" ,
      "RequiredCourses": "" ,
      "QualificationType": ""
    }

    divService.createNewCourse(body).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(body).toBeDefined();
  });

  it('createNewSite() test', () => {
    var body = {
      "AccessToken" : "" ,
      "Name" : "" ,
      "Coords" : "",
      "Description" : ""
    }

    divService.createNewSite(body).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(body).toBeDefined();
  });

});
