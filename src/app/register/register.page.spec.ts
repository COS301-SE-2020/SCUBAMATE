import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RegisterPage } from './register.page';
import { weatherService } from '../service/weather.service';
import { diveService } from '../service/dive.service';
import { accountService } from '../service/account.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import {HttpModule} from '@angular/http';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder} from '@angular/forms';

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

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let divService: diveService;
  let accService: accountService;
  let httpMock: HttpTestingController;
  let weatService: weatherService;
  let http: HttpClient;
  let router; Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([]), HttpClientTestingModule, HttpModule],
      providers: [diveService, HttpModule, accountService, weatherService, FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    divService = TestBed.get(diveService);
    accService = TestBed.get(accountService);
    weatService = TestBed.get(weatherService);
    router = TestBed.get(Router);
    httpMock = TestBed.get(HttpTestingController);
    http = TestBed.get(HttpClient);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getSpecializations() test', () => {
    var eventValue = "";

    accService.getSpecializations(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

  it('getQualifications() test', () => {
    var eventValue = "";

    accService.getQualifications(eventValue).subscribe((resp : any) => {
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

  it('insertUserDiver() test', () => {
    var eventValue = "";

    accService.insertUserDiver(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

  it('sendValidationEmail() test', () => {
    var eventValue = "";

    accService.sendValidationEmail(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

  it('insertUserInstructor() test', () => {
    var eventValue = "";

    accService.insertUserInstructor(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

  it('getDiveCourses() test', () => {
    var eventValue = "";

    divService.getDiveCourses(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

  it('Testing ngOnInit()', () => {
    component.ngOnInit();
    expect(component.showSpecialization).toBeFalse();
    expect(component.userSpecialisation).toBeDefined();
    expect(component.signUpDiver).toBeFalse();
    expect(component.signUpInstructor).toBeFalse();
    expect(component.ShowAccountChoice).toBeTrue();
    expect(component.DiverFirstPageVisible).toBeTrue();
    expect(component.DiverSecondPageVisible).toBeFalse();
    expect(component.DiverThirdPageVisible).toBeFalse();
    expect(component.DiverFourthPageVisible).toBeFalse();
    expect(component.InstructorFirstPageVisible).toBeTrue();
    expect(component.InstructorSecondPageVisible).toBeFalse();
    expect(component.InstructorThirdPageVisible).toBeFalse();
    expect(component.InstructorFourthPageVisible).toBeFalse();
    expect(component.showCourses).toBeFalse();
    expect(component.userCourses).toBeDefined();
    expect(component.courseValid).toBeFalse();
  });

  it('Testing ShowRelatedForm()', () => {
    component.ShowRelatedForm("Diver");
    expect(component.signUpDiver).toBeTrue();
    expect(component.signUpInstructor).toBeFalse();
  });

  it('Testing SpecializationListFinder()', () => {
    component.SpecializationListFinder();
    let accountSpy = spyOn(accService, 'getSpecializations').and.callThrough();
    expect(accountSpy).toBeDefined();
    expect(component.showLoading).toBeFalse();
    expect(component.SpecializationLst).toBeUndefined();
  });

  it('Testing QualificationListFinder()', () => {
    component.QualificationListFinder(validData.qualification);
    let accountSpy = spyOn(accService, 'getQualifications').and.callThrough();
    expect(accountSpy).toBeDefined();
    expect(component.showLoading).toBeTrue();
    expect(component.QualificationLst).toBeUndefined();
  });

  it('Testing CenterListFinder()', () => {
    component.CenterListFinder(validData.center);
    let diveSpy = spyOn(divService, 'getDiveCenters').and.callThrough();
    expect(diveSpy).toBeDefined();
    expect(component.showLoading).toBeTrue();
    expect(component.CenterLst).toBeUndefined();
  });

  it('Testing addSpecialization()', () => {
    component.addSpecialisation(validData.specialization);
    expect(component.showSpecialization).toBeTrue();
    expect(component.userSpecialisation).toBeDefined();
  });

  it('Testing removeSpecialization()', () => {
    component.removeSpecialisation(validData.specialization);
    expect(component.SpecializationLst).toBeDefined();
  });

  it('Testing DiverSubmit()', () => {
    component.DiverSubmit();
    expect(component.showLoading).toBeFalse();
    expect(component.diverObj.Courses).toBeDefined();
    let accountSpy = spyOn(accService, 'insertUserDiver').and.callThrough();
    expect(accountSpy).toBeDefined();
    accountSpy = spyOn(accService, 'sendValidationEmail').and.callThrough();
    expect(accountSpy).toBeDefined();
  });

  it('Testing InstructorSubmit()', () => {
    component.InstructorSubmit();
    expect(component.showLoading).toBeFalse();
    expect(component.instructorObj.Courses).toBeDefined();
    let accountSpy = spyOn(accService, 'insertUserInstructor').and.callThrough();
    expect(accountSpy).toBeDefined();
    accountSpy = spyOn(accService, 'sendValidationEmail').and.callThrough();
    expect(accountSpy).toBeDefined();
  });

  fit('Testing nextPage()', () => {
    component.nextPage();
    if(component.signUpDiver){
      if(component.DiverFirstPageVisible){
        expect(component.DiverFirstPageVisible).toBeFalse();
        expect(component.DiverSecondPageVisible).toBeTrue();
        expect(component.DiverThirdPageVisible).toBeFalse();
      }
    }
    else{
      if(component.InstructorFirstPageVisible){
        expect(component.InstructorFirstPageVisible).toBeFalse();
        expect(component.InstructorFirstPageVisible).toBeTrue();
        expect(component.InstructorFirstPageVisible).toBeFalse();
      }
    }
  });

  it('Testing previousPage()', () => {
    component.previousPage();
    if(component.signUpDiver){
      if(component.DiverFirstPageVisible){
        expect(component.DiverFirstPageVisible).toBeTrue();
        expect(component.DiverSecondPageVisible).toBeFalse();
        expect(component.DiverThirdPageVisible).toBeFalse();
      }
    }
    else{
      if(component.InstructorFirstPageVisible){
        expect(component.InstructorFirstPageVisible).toBeTrue();
        expect(component.InstructorSecondPageVisible).toBeFalse();
        expect(component.InstructorThirdPageVisible).toBeFalse();
      }
    }
  });

  it('Testing CourseListFinder()', () => {
    component.CourseListFinder();
    let diveSpy = spyOn(divService, 'getDiveCourses').and.callThrough();
    expect(diveSpy).toBeDefined();
    expect(component.showLoading).toBeFalse();
    expect(component.CourseLst).toBeUndefined();
  });

  it('Testing addCourse()', () => {
    component.addCourse();
    expect(component.userCourses).toBeDefined();
    expect(component.showCourses).toBeFalse();
    expect(component.courseInputField).toBeDefined();
    expect(component.courseValid).toBeFalse();
  });

  it('Testing removeCourse()', () => {
    component.removeCourse("C-boat diver");
    expect(component.CourseLst).toBeDefined();
  });

  it('Testing Register Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.ShowRelatedForm).toBeTruthy();
    expect(component.SpecializationListFinder).toBeTruthy();
    expect(component.QualificationListFinder).toBeTruthy();
    expect(component.CenterListFinder).toBeTruthy();
    expect(component.addSpecialisation).toBeTruthy();
    expect(component.onFileSelected).toBeTruthy();
    expect(component.previousPage).toBeTruthy();
    expect(component.removeCourse).toBeTruthy();
    expect(component.removeSpecialisation).toBeTruthy();
  });

});
