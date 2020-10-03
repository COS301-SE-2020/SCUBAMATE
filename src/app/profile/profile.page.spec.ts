import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ProfilePage } from './profile.page';
import { diveService } from '../service/dive.service';
import { accountService } from '../service/account.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import {HttpModule} from '@angular/http';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder} from '@angular/forms';

xdescribe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;
  let divService: diveService;
  let accService: accountService;
  let http: HttpClient;
  let router; Router;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([]), HttpClientTestingModule, HttpModule],
      providers: [diveService, HttpModule, accountService, FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    divService = TestBed.get(diveService);
    accService = TestBed.get(accountService);
    router = TestBed.get(Router);
    httpMock = TestBed.get(HttpTestingController);
    http = TestBed.get(HttpClient);
  }));

  xit('Succesfully Created Profile Page', () => {
    expect(component).toBeTruthy();
  });

  xit('getUser() test', () => {
    var eventValue = "";

    accService.getUser().subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

  xit('sendValidationEmail() test', () => {
    var eventValue = "";

    accService.sendValidationEmail(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

  xit('confirmEmailValidation() test', () => {
    var eventValue = "";

    accService.confirmEmailValidation(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

  xit('getUnverifiedCourses() test', () => {
    var eventValue = "";

    divService.getUnverifiedCourses().subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

  xit('VerifyCourse() test', () => {
    var eventValue = "";

    divService.VerifyCourse(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

  xit('deleteAccount() test', () => {
    var eventValue = "";

    accService.deleteAccount(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });
});
