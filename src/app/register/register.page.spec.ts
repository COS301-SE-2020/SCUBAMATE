import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { accountService } from '../service/account.service';
import { diveService } from '../service/dive.service';
import { weatherService } from '../service/weather.service';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { RegisterPage } from './register.page';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '../app.module';

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
  let accService: accountService;
  let divService: diveService;
  let weatService: weatherService;
  let http: HttpClient;
  let router; Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([]), AppModule],
      providers: [accountService, diveService, weatherService]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    accService = new accountService(http, router);
    divService = new diveService(http, router);
    weatService = new weatherService(http, router);
    router = TestBed.get(Router);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Testing Register components', () => {
    expect(component.uuidValue).toBeDefined();
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

  });

  it('Testing SpecializationListFinder()', () => {
    component.SpecializationListFinder();
    let accountSpy = spyOn(accService, 'getSpecializations').and.callThrough();
    expect(accountSpy).toBeDefined();
    expect(component.showLoading).toBeFalse();
    expect(component.SpecializationLst).toBeUndefined();
  });

  it('Testing QualificationListFinder()', () => {
    component.QualificationListFinder("Advanced Open Water Diver");
    let accountSpy = spyOn(accService, 'getQualifications').and.callThrough();
    expect(accountSpy).toBeDefined();
    expect(component.showLoading).toBeTrue();
    expect(component.QualificationLst).toBeUndefined();
  });

  it('Testing CenterListFinder()', () => {
    component.CenterListFinder("Reefteach");
    let diveSpy = spyOn(divService, 'getDiveCenters').and.callThrough();
    expect(diveSpy).toBeDefined();
    expect(component.showLoading).toBeTrue();
    expect(component.CenterLst).toBeUndefined();
  });

  it('Testing addSpecialization()', () => {
    component.addSpecialisation("Ice Master");
    expect(component.showSpecialization).toBeTrue();
    expect(component.userSpecialisation).toBeDefined();
  });

  it('Testing removeSpecialization()', () => {
    component.removeSpecialisation("Ice Master");
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
    let navigateSpy = spyOn(router, 'navigate');
    expect(navigateSpy).toHaveBeenCalledWith(['login']);
  });

  it('Testing InstructorSubmit()', () => {
    component.InstructorSubmit();
    expect(component.showLoading).toBeFalse();
    expect(component.instructorObj.Courses).toBeDefined();
    let accountSpy = spyOn(accService, 'insertUserInstructor').and.callThrough();
    expect(accountSpy).toBeDefined();
    accountSpy = spyOn(accService, 'sendValidationEmail').and.callThrough();
    expect(accountSpy).toBeDefined();
    let navigateSpy = spyOn(router, 'navigate');
    expect(navigateSpy).toHaveBeenCalledWith(['login']);
  });

  it('Testing nextPage()', () => {
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
        expect(component.InstructorFirstPageVisible).toBeFalse();
        expect(component.InstructorFirstPageVisible).toBeFalse();
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
    component.removeCourse("");
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
