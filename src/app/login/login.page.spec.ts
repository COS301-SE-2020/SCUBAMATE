import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
  }));

  it('Succesfully Created Login Page', () => {
    expect(component).toBeTruthy();
  });

  it('logUser() test', () => {
    var eventValue = {

    };

    accService.logUser(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBeDefined();
  });
});
