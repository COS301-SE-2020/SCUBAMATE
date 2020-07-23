import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { EditProfilePage } from './edit-profile.page';
import { AppModule } from '../app.module';
import { accountService } from '../service/account.service';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

var validData = {
  birthD: "1990-05-06",
  firstN: "Harry",
  lName: "Potter",
  public: false
};

describe('EditProfilePage', () => {
  let component: EditProfilePage;
  let fixture: ComponentFixture<EditProfilePage>;
  let accService: accountService;
  let http: HttpClient;
  let router; Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProfilePage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([]), AppModule],
      providers: [accountService]
    }).compileComponents();

    fixture = TestBed.createComponent(EditProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    accService = new accountService(http, router);
    router = TestBed.get(Router);
  }));

  it('Successfully Created Edit-Profile Page', () => {
    expect(component).toBeTruthy();
  });

  it('Testing Edit-Page Components', () => {
    expect(component.AD).toBeUndefined();
    expect(component.loginLabel).toBeDefined();
    expect(component.showData).toBeFalse();
  });

  it('Testing ngOnInit()', () => {
    component.ngOnInit();
    let accountSpy = spyOn(accService, 'getUser').and.callThrough();
    expect(accountSpy).toBeDefined();
    expect(component.loginLabel).toBe("Login");
    expect(component.showData).toBeFalse();
    expect(component.AD).toBeUndefined();
  });

  it('Testing loginClick()', () => {
    let navigateSpy = spyOn(router, 'navigate');
    component.loginClick();
    expect(navigateSpy).toHaveBeenCalledWith(['login']);
  });

  it('Testing onSubmit()', () => {
    component.onSubmit(validData.birthD, validData.firstN, validData.lName, validData.public, event);
    let accountSpy = spyOn(accService, 'editUser').and.callThrough();
    expect(accountSpy).toBeDefined();
  });

  it('Testing Edit-Page Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.loginClick).toBeTruthy();
    expect(component.onSubmit).toBeTruthy();
  });
});
