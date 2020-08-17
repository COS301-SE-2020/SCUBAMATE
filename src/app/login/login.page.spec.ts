import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginPage } from './login.page';
import { AppModule } from '../app.module';
import { accountService } from '../service/account.service';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

var validData = {
  email: "teamav301@gmail.com",
  pass: "Scuba@AWS301!",
  accessToken : "d1d7391d-c035-28ab-0193-68a7d263d4be11ac76afb3c161…0702085a1c423b0ed53f38b9a0e6e0ad8bfe8cd3712f14be7"
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
    localStorage.setItem("accessToken", validData.accessToken);
    component.ngOnInit();
    expect(component.loginLabel).toBe("Sign Out");
  });

  it('Testing ionViewWillEnter()', () => {
    localStorage.setItem("accessToken", validData.accessToken);
    component.ionViewWillEnter();
    expect(component.loginLabel).toBe("Sign Out");
  });

  it('Testing loginClick()', () => {
    component.loginClick();
    expect(localStorage.getItem("accessToken")).toBeDefined();
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
