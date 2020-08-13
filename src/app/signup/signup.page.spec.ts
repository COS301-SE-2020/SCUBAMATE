import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { SignupPage } from './signup.page';
import { AppModule } from '../app.module';
import { accountService } from '../service/account.service';
import { diveService } from '../service/dive.service';
import { weatherService } from '../service/weather.service';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

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

describe('SignupPage', () => {
  let component: SignupPage;
  let fixture: ComponentFixture<SignupPage>;
  let accService: accountService;
  let divService: diveService;
  let weatService: weatherService;
  let http: HttpClient;
  let router; Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([]), AppModule],
      providers: [accountService, diveService, weatherService]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    accService = new accountService(http, router);
    divService = new diveService(http, router);
    weatService = new weatherService(http, router);
    router = TestBed.get(Router);
  }));

  it('Successfully Created Sign Up Page', () => {
    expect(component).toBeTruthy();
  });

  it('Testing SignUp Components', () => {
    expect(component.uuidValue).toBeUndefined();
    expect(component.base64textString).toBeUndefined();
    expect(component.showLoading).toBeFalse();
    expect(component.showSpecialization).toBeFalse();
    expect(component.SpecializationLst).toBeUndefined();
    expect(component.QualificationLst).toBeUndefined();
    expect(component.CenterLst).toBeUndefined();
    expect(component.userSpecialisation).toBeDefined();
    expect(component.signUpDiver).toBeFalse();
    expect(component.signUpInstructor).toBeFalse();
    expect(component.ShowAccountChoice).toBeTrue();
  });

  it('Testing ngOnInit()', () => {
    component.ngOnInit();
    expect(component.showSpecialization).toBeFalse();
    expect(component.userSpecialisation).toBeDefined();
    expect(component.signUpDiver).toBeFalse();
    expect(component.signUpInstructor).toBeFalse();
    expect(component.ShowAccountChoice).toBeTrue();
  });

  it('Testing ShowRelatedForm()', () => {
    component.ShowRelatedForm("Diver");
    expect(component.signUpDiver).toBeTrue();
    expect(component.signUpInstructor).toBeFalse();
  });

  it('Testing SpecializationListFinder()', () => {
    //component.SpecializationListFinder("Wreck Diver");
    let accountSpy = spyOn(accService, 'getSpecializations').and.callThrough();
    expect(accountSpy).toBeDefined();
    expect(component.showLoading).toBeTrue();
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

  it('Testing addSpecialisation()', () => {
    component.addSpecialisation("Ice Master");
    expect(component.showSpecialization).toBeTrue();
  });

  // fit('Testing onFileSelected()', () => {
  //   component.onFileSelected(event);
  // });

  it('Testing onSubmitDiver()', () => {
    //component.onSubmitDiver(validData.qualification, validData.specialization, validData.bday, validData.firstN, validData.lastN, validData.pub, validData.email, validData.pass, validData.cPass, event);
    let accountSpy = spyOn(accService, 'insertUserDiver').and.callThrough();
    expect(accountSpy).toBeDefined();
    accountSpy = spyOn(accService, 'sendValidationEmail').and.callThrough();
    expect(accountSpy).toBeDefined();
    expect(component.uuidValue).toBeDefined();
  });

  it('Testing onSubmitInstructor()', () => {
    //component.onSubmitInstructor(validData.qualification, validData.center, validData.iNum, validData.bday, validData.firstN, validData.lastN, validData.pub, validData.email, validData.pass, validData.cPass, event);
    let accountSpy = spyOn(accService, 'insertUserInstructor').and.callThrough();
    expect(accountSpy).toBeDefined();
    accountSpy = spyOn(accService, 'sendValidationEmail').and.callThrough();
    expect(accountSpy).toBeDefined();
    expect(component.uuidValue).toBeDefined();
  });

  it('Testing SignUp Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.ShowRelatedForm).toBeTruthy();
    expect(component.SpecializationListFinder).toBeTruthy();
    expect(component.QualificationListFinder).toBeTruthy();
    expect(component.CenterListFinder).toBeTruthy();
    expect(component.addSpecialisation).toBeTruthy();
    expect(component.onFileSelected).toBeTruthy();
    //expect(component.onSubmitDiver).toBeTruthy();
    //expect(component.onSubmitInstructor).toBeTruthy();
  });
});
