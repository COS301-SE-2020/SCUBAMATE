import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { SignupPage } from './signup.page';
import { AppModule } from '../app.module';
import { ExplorePage } from '../explore/explore.page';

describe('SignupPage', () => {
  let component: SignupPage;
  let fixture: ComponentFixture<SignupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, AppModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
    component.SpecializationListFinder("");
    expect(component.showLoading).toBeFalse();
    expect(component.SpecializationLst).toBeUndefined();
  });

  it('Testing QualificationListFinder()', () => {
    component.QualificationListFinder("");
    expect(component.showLoading).toBeFalse();
    expect(component.QualificationLst).toBeUndefined();
  });

  it('Testing CenterListFinder()', () => {
    component.CenterListFinder("");
    expect(component.showLoading).toBeFalse();
    expect(component.CenterLst).toBeUndefined();
  });

  it('Testing addSpecialisation()', () => {
    component.addSpecialisation("");
    expect(component.showSpecialization).toBeFalse();
  });

  // fit('Testing onFileSelected()', () => {
  //   component.onFileSelected(event);
  // });

  it('Testing onSubmitDiver()', () => {
    component.onSubmitDiver("", "", "", "", "", false, "", "", "", event);
    expect(component.uuidValue).toBeUndefined();
  });

  it('Testing onSubmitInstructor()', () => {
    component.onSubmitInstructor("", "", "", "", "", "", false, "", "", "", event);
    expect(component.uuidValue).toBeUndefined();
  });

  it('Testing SignUp Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.ShowRelatedForm).toBeTruthy();
    expect(component.SpecializationListFinder).toBeTruthy();
    expect(component.QualificationListFinder).toBeTruthy();
    expect(component.CenterListFinder).toBeTruthy();
    expect(component.addSpecialisation).toBeTruthy();
    expect(component.onFileSelected).toBeTruthy();
    expect(component.onSubmitDiver).toBeTruthy();
    expect(component.onSubmitInstructor).toBeTruthy();
  });
});
