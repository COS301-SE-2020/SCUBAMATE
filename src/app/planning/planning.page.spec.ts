import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { PlanningPage } from './planning.page';
import { diveService } from '../service/dive.service';
import { accountService } from '../service/account.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import {HttpModule} from '@angular/http';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder} from '@angular/forms';

var accessToken = "d1d7391d-c035-28ab-0193-68a7d263d4be11bf1decf78d036abdad2f76f0e68ffeb1651b146d3eb2314ef2401a989bd190ce";

describe('PlanningPage', () => {
  let component: PlanningPage;
  let fixture: ComponentFixture<PlanningPage>;
  let divService: diveService;
  let accService: accountService;
  let http: HttpClient;
  let router; Router;
  let httpMock: HttpTestingController;
  

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanningPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([]), HttpClientTestingModule, HttpModule],
      providers: [diveService, HttpModule, accountService, FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(PlanningPage);
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

  it('getSuggestedCourses() test', () => {
    var eventValue = "";

    divService.getSuggestedCourses().subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

  it('getCustomCheckList() test', () => {
    var eventValue = "";

    accService.getCustomChecklist().subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

  it('getCheckList() test', () => {
    var eventValue = "";

    divService.getCheckList(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

  it('getDiveTypes() test', () => {
    var eventValue = "";

    divService.getDiveTypes(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

  it('storeCustomChecklist() test', () => {
    var eventValue = "";

    accService.storeCustomChecklist(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });

  it('sendCourseSurveyAnswers() test', () => {
    var eventValue = "";

    divService.sendCourseSurveyAnswers(eventValue).subscribe((resp : any) => {
      console.log(resp);
    });

    expect(eventValue).toBe("");
  });
});
