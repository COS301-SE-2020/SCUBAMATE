import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { EditDivePage } from './edit-dive.page';
import { diveService } from '../service/dive.service';
import { accountService } from '../service/account.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import {HttpModule} from '@angular/http';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder} from '@angular/forms';

describe('EditDivePage', () => {
  let component: EditDivePage;
  let fixture: ComponentFixture<EditDivePage>;
  let divService: diveService;
  let accService: accountService;
  let http: HttpClient;
  let router; Router;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDivePage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([]), HttpClientTestingModule, HttpModule],
      providers: [diveService, HttpModule, accountService, FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(EditDivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    divService = TestBed.get(diveService);
    accService = TestBed.get(accountService);
    router = TestBed.get(Router);
    httpMock = TestBed.get(HttpTestingController);
    http = TestBed.get(HttpClient);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updateDive() test', () => {
    var reqBody = {
      DiveID: "",
      AccessToken: "",
      Buddy: "bud",
      InstructorLink: "-",
      Description: "desc",
      DivePublicStatus: "pub"
    };

    divService.updateDive(reqBody).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(reqBody).toBeDefined();
  });

  it('lookAheadBuddy() test', () => {
    var eventValue = "";

    accService.lookAheadBuddy(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

  it('getIndividualDive() test', () => {
    var reqBody = {
      AccessToken: "",
      DiveID: ""
    }

    divService.getIndividualDive(reqBody).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(reqBody).toBeDefined();
  });

  it('updateDive() test', () => {
    var diveObj = {
      AccessToken: "",
      DiveID: ""
    }

    divService.updateDive(diveObj).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(diveObj).toBeDefined();
  });

});
