import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginPage } from './login.page';
import { AppModule } from '../app.module';
import { accountService } from '../service/account.service';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

var validData = {
  email: "u17026127@tuks.co.za",
  pass: "Scuba@AWS301!"
};

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let accService: accountService;
  let http: HttpClient;
  let router; Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([]), AppModule],
      providers: [accountService]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    accService = new accountService(http, router);
    router = TestBed.get(Router);
  }));

  it('Succesfully Created Login Page', () => {
    expect(component).toBeTruthy();
  });

  it('Testing Login Components', () => {
    expect(component.loginLabel).toBeDefined();
  });

  it('Testing ngOnInit()', () => {
    component.ngOnInit();
    expect(component.loginLabel).toBe("Sign Out");
  });

  it('Testing ionViewWillEnter()', () => {
    component.ionViewWillEnter();
    expect(component.loginLabel).toBe("Sign Out");
  });

  it('Testing loginClick()', () => {
    let navigateSpy = spyOn(router, 'navigate');
    component.loginClick();
    expect(navigateSpy).toBeDefined();
  });

  it('Testing onSubmit()', () => {
    component.onSubmit(validData.email, validData.pass, event);
    let navigateSpy = spyOn(router, 'navigate');
    let accountSpy = spyOn(accService, 'logUser').and.callThrough();
    expect(accountSpy).toBeDefined();
    expect(navigateSpy).toHaveBeenCalledWith(['home']);
  });

  it('Testing Login Functionality', () => {
    expect(component.ngOnInit).toBeDefined();
    expect(component.ionViewWillEnter).toBeDefined();
    expect(component.loginClick).toBeTruthy();
    expect(component.onSubmit).toBeTruthy();
  });
});
