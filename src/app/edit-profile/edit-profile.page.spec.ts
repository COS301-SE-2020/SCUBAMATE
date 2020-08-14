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

var accessToken = "d1d7391d-c035-28ab-0193-68a7d263d4be11bf1decf78d036abdad2f76f0e68ffeb1651b146d3eb2314ef2401a989bd190ce";

describe('EditProfilePage', () => {
  let component: EditProfilePage;
  let fixture: ComponentFixture<EditProfilePage>;
  let accService: accountService;
  let http: HttpClient;
  let router; Router;
  localStorage.setItem("accessToken", accessToken);

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
    localStorage.setItem("accessToken", accessToken);
    expect(component).toBeTruthy();
  });

  it('Testing Edit-Page Components', () => {
    expect(component.AD).toBeUndefined();
    expect(component.loginLabel).toBeDefined();
    expect(component.showData).toBeFalse();
  });

  it('Testing ngOnInit()', () => {
    component.ngOnInit();
    expect(component.loginLabel).toBe("Log Out");
    expect(component.showData).toBeFalse();
  });

  it('Testing loginClick()', () => {
    let navigateSpy = spyOn(router, 'navigate');
    component.loginClick();
    expect(navigateSpy).toHaveBeenCalledWith(['home']);
  });

  it('Testing onSubmit()', () => {
    let navigateSpy = spyOn(router, 'navigate');
    component.UpdateSubmit();
    let accountSpy = spyOn(accService, 'editUser').and.callThrough();
    expect(accountSpy).toBeDefined();
    expect(navigateSpy).toHaveBeenCalledWith(['profile']);
  });

  it('Testing Edit-Page Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.loginClick).toBeTruthy();
    expect(component.UpdateSubmit).toBeTruthy();
  });
});
