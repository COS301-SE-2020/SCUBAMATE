import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { SignupPage } from './signup.page';
import { AppModule } from '../app.module';

fdescribe('SignupPage', () => {
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

  fit('should create', () => {
    expect(component).toBeTruthy();
  });

  fit('Testing SignUp Components', () => {
    //expect(component.uuidValue).toBeDefined();
    //expect(component.base64textString).toBeDefined();
    expect(component.showLoading).toBeFalse();
    expect(component.showSpecialization).toBeFalse();
    //expect(component.SpecializationLst).toBeDefined();
    //expect(component.QualificationLst).toBeDefined();
    //expect(component.CenterLst).toBeDefined();
    expect(component.userSpecialisation).toBeDefined();
    expect(component.signUpDiver).toBeFalse();
    expect(component.signUpInstructor).toBeFalse();
    //expect(component.ShowAccountChoice).toBeFalse();
  });

  fit('Testing SignUp Functionality', () => {
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
