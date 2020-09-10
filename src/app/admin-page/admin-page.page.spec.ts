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
import { map } from 'rxjs/operators';

var reqBody = {
  AccessToken : "d1d7391d-c035-28ab-0193-68a7d263d4be11018bb4bb890ede82397fea8e38e8cb3b5646f4053ff8c04aec7048b8c3d4376e",
  DiveID : "Dda76ff1c-fc3b-3611-1341-e946a674de6f"
};

var validData = {
  pub: false,
  desc: "Saw Sharks",
  site: "Shark Alley",
  qualification: "Advanced Open Water Diver",
  date: "2018-01-04",
  timeIn: "12:00",
  timeOut: "13:00",
  diveType: "Training Dive",
  buddy: "John Cena",
  vis: "13m",
  dep: "12m",
  aT: 12,
  surfaceT: 13,
  bottomT: 7,
  accessToken : "d1d7391d-c035-28ab-0193-68a7d263d4be11ac76afb3c161…0702085a1c423b0ed53f38b9a0e6e0ad8bfe8cd3712f14be7"
};

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
    localStorage.setItem("AccessToken", validData.accessToken);
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

  it('centerListFinder() test', () => {
    var eventValue = "Reef";

    divService.getDiveCenters(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("Reef");
  });

  it('courseListFinder() test', () => {
    let diveSpy = spyOn(divService, 'getDiveCourses').and.callThrough();
    expect(diveSpy).toBeDefined();
    let response = divService.getDiveCourses(validData.qualification).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(diveSpy).toBeDefined();
    expect(divService.getDiveCourses).toHaveBeenCalledWith(validData.qualification);
  });

  it('getDiveSites() test', () => {
    let diveSpy = spyOn(divService, 'getDiveSites').and.callThrough();
    expect(diveSpy).toBeDefined();
    let response = divService.getDiveSites(validData.site).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(diveSpy).toBeDefined();
    expect(divService.getDiveSites).toHaveBeenCalledWith(validData.site);
  });

  it('getUnverifiedInsrtuctors() test', fakeAsync(() => {
    let accountSpy = spyOn(accService, 'getUnverifiedInstructors').and.callThrough();
    expect(accountSpy).toBeDefined();
    let response = accService.getUnverifiedInstructors().pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(accountSpy).toBeDefined();
    expect(accService.getUnverifiedInstructors).toHaveBeenCalled();
  }));

  it('getAdmimDiveCenter() test', () => {
    var bod = {
      AccessToken: "d1d7391d-c035-28ab-0193-68a7d263d4be119b81fe6d1062ae1debb83521e940bcad6efea2c0c42c0e5224745a2078835b3b"
    };
    let diveSpy = spyOn(divService, 'getAdminDiveCenter').and.callThrough();
    expect(diveSpy).toBeDefined();
    let response = divService.getAdminDiveCenter(bod.AccessToken).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(diveSpy).toBeDefined();
    expect(divService.getAdminDiveCenter).toHaveBeenCalledWith(bod.AccessToken);
  });

  it('addUserToDiveCenter() test', () => {
    var eventValue = {

    };
    let accountSpy = spyOn(accService, 'addUsertoDiveCenter').and.callThrough();
    expect(accountSpy).toBeDefined();
    let response = accService.addUsertoDiveCenter(eventValue).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(accountSpy).toBeDefined();
    expect(accService.addUsertoDiveCenter).toHaveBeenCalledWith(eventValue);
  });

  it('addDiveCenter() test', () => {
    var eventValue = {

    };
    let accountSpy = spyOn(accService, 'addDiveCenter').and.callThrough();
    expect(accountSpy).toBeDefined();
    let response = accService.addDiveCenter(eventValue).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(accountSpy).toBeDefined();
    expect(accService.addDiveCenter).toHaveBeenCalledWith(eventValue);
  });

  it('verifyInstructor() test', () => {
    var eventValue = {
      AccountVerified: true,
      AccessToken: "d1d7391d-c035-28ab-0193-68a7d263d4be119b81fe6d1062ae1debb83521e940bcad6efea2c0c42c0e5224745a2078835b3b",
      AccountGuid: "d1d7391d-c035-28ab-0193-68a7d263d4be"
    };
    let accountSpy = spyOn(accService, 'verifyInstructor').and.callThrough();
    expect(accountSpy).toBeDefined();
    let response = accService.verifyInstructor(eventValue).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(accountSpy).toBeDefined();
    expect(accService.verifyInstructor).toHaveBeenCalledWith(eventValue);
  });

  it('updateDiveCenterSubmit() test', () => {
    var body ={
      "AccessToken" : validData.accessToken,
      "Name" : "" ,
      "Coords": "" , 
      "Description": "",
      "LogoPhoto" :  ""
    };
    let diveSpy = spyOn(divService, 'editBasicDiveCentre').and.callThrough();
    expect(diveSpy).toBeDefined();
    let response = divService.editBasicDiveCentre(body).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(diveSpy).toBeDefined();
    expect(divService.editBasicDiveCentre).toHaveBeenCalledWith(body);
  });

  it('addCoursesToDiveCenter() test', () => {
    var body ={
      "AccessToken" : validData.accessToken,
      "Name" : "" ,
      "Courses": ""
    }
    let diveSpy = spyOn(divService, 'addCoursesToDiveCentre').and.callThrough();
    expect(diveSpy).toBeDefined();
    let response = divService.addCoursesToDiveCentre(body).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(diveSpy).toBeDefined();
    expect(divService.addCoursesToDiveCentre).toHaveBeenCalledWith(body);
  });

  it('addDiveSitesToCentre() test', () => {
    var body ={
      "AccessToken" : validData.accessToken,
      "Name" : "" ,
      "DiveSites": ""
    }
    let diveSpy = spyOn(divService, 'addDiveSitesToCentre').and.callThrough();
    expect(diveSpy).toBeDefined();
    let response = divService.addDiveSitesToCentre(body).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(diveSpy).toBeDefined();
    expect(divService.addDiveSitesToCentre).toHaveBeenCalledWith(body);
  });

  it('createNewCourse() test', () => {
    var body = {
      "AccessToken" : validData.accessToken,
      "Name": "" , 
      "CourseType": "" ,
      "MinAgeRequired": "" ,
      "SurveyAnswer": "" ,
      "RequiredCourses": "" ,
      "QualificationType": ""
    }
    let diveSpy = spyOn(divService, 'createNewCourse').and.callThrough();
    expect(diveSpy).toBeDefined();
    let response = divService.createNewCourse(body).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(diveSpy).toBeDefined();
    expect(divService.createNewCourse).toHaveBeenCalledWith(body);
  });

  it('createNewSite() test', () => {
    var body = {
      "AccessToken" : validData.accessToken,
      "Name" : "" ,
      "Coords" : "",
      "Description" : ""
    }
    let diveSpy = spyOn(divService, 'createNewSite').and.callThrough();
    expect(diveSpy).toBeDefined();
    let response = divService.createNewSite(body).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(diveSpy).toBeDefined();
    expect(divService.createNewSite).toHaveBeenCalledWith(body);
  });

  it('Testing Log-Dive Components', () => {
    expect(component.showLoading).toBeFalse();
    expect(component.DiveSiteLst).toBeUndefined();
    expect(component.BuddyLst).toBeUndefined();
    expect(component.loginLabel).toBe("Log Out");
    expect(component.accountType).toBe("SuperAdmin");
    expect(component.base64textString).toBeUndefined();
    expect(component.CenterLst).toBeUndefined();
    expect(component.CourseLst).toBeUndefined();
    expect(component.showCourses).toBeFalse();
    expect(component.userCourses).toBeDefined();
    expect(component.courseInputField).toBeDefined();
    expect(component.siteInput).toBeUndefined();
    expect(component.siteUserInput).toBeDefined();
    expect(component.showSites).toBeDefined();
    expect(component.showRegisterUserToCenter).toBeFalse();
    expect(component.showRegisterNewCenter).toBeFalse();
    expect(component.showUnverifiedInstructors).toBeUndefined();
    expect(component.showVerifiedInstructors).toBeUndefined();
    expect(component.showEditBasicDiveCentre).toBeFalse();
    expect(component.showAddCourse).toBeFalse();
    expect(component.showAddSite).toBeFalse();
    expect(component.showAddCourseToCentre).toBeFalse();
    expect(component.showAddSiteToCentre).toBeFalse();
    expect(component.verifiedInstructors).toBeDefined();
    expect(component.unverifiedInstructors).toBeDefined();
    expect(component.allInstructors).toBeDefined();
    expect(component.firstPageNewCentre).toBeFalse();
    expect(component.secondPageNewCentre).toBeFalse();
    expect(component.thirdPageNewCentre).toBeFalse();
    expect(component.fourthPageNewCentre).toBeFalse();
    expect(component.UserToCenterObj).toBeDefined();
    expect(component.NewCenterObj).toBeDefined();
    expect(component.NewCourseObj).toBeDefined();
    expect(component.NewSiteObj).toBeDefined();
    expect(component.currentDiveCenter).toBeDefined();
  });

  it('Testing ngOnInit()', () => {
    component.ngOnInit();
    expect(component.showLoading).toBeFalse();
    expect(component.DiveSiteLst).toBeUndefined();
    expect(component.BuddyLst).toBeUndefined();
    expect(component.loginLabel).toBe("Log Out");
    expect(component.accountType).toBe("SuperAdmin");
    expect(component.base64textString).toBeUndefined();
    expect(component.CenterLst).toBeUndefined();
    expect(component.CourseLst).toBeUndefined();
    expect(component.showCourses).toBeFalse();
    expect(component.userCourses).toBeDefined();
    expect(component.courseInputField).toBeDefined();
    expect(component.siteInput).toBeUndefined();
    expect(component.siteUserInput).toBeDefined();
    expect(component.showSites).toBeDefined();
    expect(component.showRegisterUserToCenter).toBeFalse();
    expect(component.showRegisterNewCenter).toBeFalse();
    expect(component.showUnverifiedInstructors).toBeUndefined();
    expect(component.showVerifiedInstructors).toBeUndefined();
    expect(component.showEditBasicDiveCentre).toBeFalse();
    expect(component.showAddCourse).toBeFalse();
    expect(component.showAddSite).toBeFalse();
    expect(component.showAddCourseToCentre).toBeFalse();
    expect(component.showAddSiteToCentre).toBeFalse();
    expect(component.verifiedInstructors).toBeDefined();
    expect(component.unverifiedInstructors).toBeDefined();
    expect(component.allInstructors).toBeDefined();
    expect(component.firstPageNewCentre).toBeFalse();
    expect(component.secondPageNewCentre).toBeFalse();
    expect(component.thirdPageNewCentre).toBeFalse();
    expect(component.fourthPageNewCentre).toBeFalse();
    expect(component.UserToCenterObj).toBeDefined();
    expect(component.NewCenterObj).toBeDefined();
    expect(component.NewCourseObj).toBeDefined();
    expect(component.NewSiteObj).toBeDefined();
    expect(component.currentDiveCenter).toBeDefined();
  });

  it('Testing ionViewWillEnter()', () => {
    component.ionViewWillEnter();
    expect(component.showLoading).toBeFalse();
    expect(component.DiveSiteLst).toBeUndefined();
    expect(component.BuddyLst).toBeUndefined();
    expect(component.loginLabel).toBe("Log Out");
    expect(component.accountType).toBe("SuperAdmin");
    expect(component.base64textString).toBeUndefined();
    expect(component.CenterLst).toBeUndefined();
    expect(component.CourseLst).toBeUndefined();
    expect(component.showCourses).toBeFalse();
    expect(component.userCourses).toBeDefined();
    expect(component.courseInputField).toBeDefined();
    expect(component.siteInput).toBeUndefined();
    expect(component.siteUserInput).toBeDefined();
    expect(component.showSites).toBeDefined();
    expect(component.showRegisterUserToCenter).toBeFalse();
    expect(component.showRegisterNewCenter).toBeFalse();
    expect(component.showUnverifiedInstructors).toBeUndefined();
    expect(component.showVerifiedInstructors).toBeUndefined();
    expect(component.showEditBasicDiveCentre).toBeFalse();
    expect(component.showAddCourse).toBeFalse();
    expect(component.showAddSite).toBeFalse();
    expect(component.showAddCourseToCentre).toBeFalse();
    expect(component.showAddSiteToCentre).toBeFalse();
    expect(component.verifiedInstructors).toBeDefined();
    expect(component.unverifiedInstructors).toBeDefined();
    expect(component.allInstructors).toBeDefined();
    expect(component.firstPageNewCentre).toBeFalse();
    expect(component.secondPageNewCentre).toBeFalse();
    expect(component.thirdPageNewCentre).toBeFalse();
    expect(component.fourthPageNewCentre).toBeFalse();
    expect(component.UserToCenterObj).toBeDefined();
    expect(component.NewCenterObj).toBeDefined();
    expect(component.NewCourseObj).toBeDefined();
    expect(component.NewSiteObj).toBeDefined();
    expect(component.currentDiveCenter).toBeDefined();
  });

  it('Testing Log-Dive Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.ionViewWillEnter).toBeTruthy();
    expect(component.loginClick).toBeTruthy();
    expect(component.buddyListFinder).toBeTruthy();
    expect(component.viewRegisterUserToCenter).toBeTruthy();
    expect(component.viewRegisterNewCenter).toBeTruthy();
    expect(component.viewUnverifiedInstructors).toBeTruthy();
    expect(component.viewVerifiedInstructors).toBeTruthy();
    expect(component.viewAddBasicCentre).toBeTruthy();
    expect(component.viewAddCourseToCentre).toBeTruthy();
    expect(component.viewAddCourse).toBeTruthy();
    expect(component.viewAddSiteToCentre).toBeTruthy();
    expect(component.viewAddSite).toBeTruthy();
    expect(component.hideAllViews).toBeTruthy();
    expect(component.next).toBeTruthy();
    expect(component.previous).toBeTruthy();
    expect(component.CenterListFinder).toBeTruthy();
    expect(component.CourseListFinder).toBeTruthy();
    expect(component.addCourse).toBeTruthy();
    expect(component.removeCourse).toBeTruthy();
    expect(component.addCourseToDiveCentre).toBeTruthy();
    expect(component.removeCourseFromDiveCentre).toBeTruthy();
    expect(component.addCourseToCourse).toBeTruthy();
    expect(component.removeCourseFromCourse).toBeTruthy();
    expect(component.addSiteToDiveCentre).toBeTruthy();
    expect(component.removeSiteFromDiveCentre).toBeTruthy();
    expect(component.DiveSiteListFinder).toBeTruthy();
    expect(component.addSite).toBeTruthy();
    expect(component.removeSite).toBeTruthy();
    expect(component.getUnverifiedInstructors).toBeTruthy();
    expect(component.getDiveCentreInformation).toBeTruthy();
    expect(component.UserToCenterSubmit).toBeTruthy();
    expect(component.newDiveCenterSubmit).toBeTruthy();
    expect(component.verifyInstructor).toBeTruthy();
    expect(component.removeInstructor).toBeTruthy();
    expect(component.updateDiveCentreSubmit).toBeTruthy();
    expect(component.updateCoursesOfDiveCentreSubmit).toBeTruthy();
    expect(component.createNewCourseSubmit).toBeTruthy();
    expect(component.createNewSiteSubmit).toBeTruthy();
  });

});
