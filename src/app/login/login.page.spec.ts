import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { LoginPage } from './login.page';
import { diveService } from '../service/dive.service';
import { accountService } from '../service/account.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import {HttpModule} from '@angular/http';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder} from '@angular/forms';

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
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([]), HttpClientTestingModule, HttpModule],
      providers: [diveService, HttpModule, accountService, FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    accService = TestBed.get(accountService);
    router = TestBed.get(Router);
    httpMock = TestBed.get(HttpTestingController);
    http = TestBed.get(HttpClient);
    localStorage.setItem("accessToken", validData.accessToken);
  }));

  it('Succesfully Created Login Page', () => {
    expect(component).toBeTruthy();
  });

  it('LogUser() test', fakeAsync(() => {
    let response = null;
    var eventValue = {
      Email: "teamav301@gmail.com",
      Password: "Scuba@AWS301!"
    };

    console.log("Getting ready to call LogUser()...")
    accService.logUser(eventValue).subscribe(
      (resp: any) => {
        console.log(resp);
        response = resp;
        console.log(response);
        console.log('Calling api')
      },
      (error: any) => {
        console.error();
      }
    );
    console.log("Done calling")
    tick();
    expect(eventValue).toBeDefined();
    expect(response).toBeDefined();
  }));

  it('Testing ngOnInit()', () => {
    component.ngOnInit();
    expect(component.loginLabel).toBe("Sign Out");
  });

  it('Testing ionViewWillEnter()', () => {
    component.ionViewWillEnter();
    expect(component.loginLabel).toBe("Sign Out");
  });

  it('Testing onSubmit()', () => {
    let navigateSpy = spyOn(router, 'navigate');
    component.onSubmit(validData.email, validData.pass, event);
    let accountSpy = spyOn(accService, 'logUser').and.callThrough();
    expect(accountSpy).toBeDefined();
  });

  it('Testing Login Functionality', () => {
    expect(component.ngOnInit).toBeDefined();
    expect(component.ionViewWillEnter).toBeDefined();
    expect(component.loginClick).toBeTruthy();
    expect(component.onSubmit).toBeTruthy();
  });

});
