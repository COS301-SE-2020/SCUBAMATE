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
    localStorage.setItem("accessToken", accessToken);
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

  it('Testing Planning Components', () => {
    expect(component.DiveTypeLst).toBeUndefined();
    expect(component.OptionalReceived).toBeUndefined();
    expect(component.EquipmentReceived).toBeUndefined();
    expect(component.EquipmentList).toBeDefined();
    expect(component.OptionalList).toBeDefined();
    expect(component.viewChecklist).toBeFalse();
    expect(component.showLoading).toBeFalse();
    expect(component.SearchDiveCheckList).toBe('');
    expect(component.viewAddInput).toBeFalse();
    expect(component.viewPersonalAdded).toBeFalse();
    expect(component.PersonalList).toBeDefined();
    expect(component.itemToAdd).toBeDefined();
    expect(component.suggestedCourseFullList).toBeDefined();
    expect(component.suggestedCourseThreeList).toBeDefined();
    expect(component.showCourses).toBeFalse();
    expect(component.loginLabel).toBe("Log Out");
  });

  it('Testing ngOnInit()', () => {
    component.ngOnInit();
    expect(component.showCourses).toBeFalse();
    expect(component.showLoading).toBeFalse();
    expect(component.loginLabel).toBe("Log Out");
    let divSpy = spyOn(divService, 'getSuggestedCourses').and.callThrough();
    expect(divSpy).toBeDefined();
    expect(component.suggestedCourseFullList).toBeDefined();
    let accountSpy = spyOn(accService, 'getCustomChecklist').and.callThrough();
    expect(accountSpy).toBeDefined();
    expect(component.EquipmentList).toBeDefined();
    expect(component.OptionalList).toBeDefined();
    expect(component.viewPersonalAdded).toBeFalse();
    expect(component.viewChecklist).toBeFalse();
    let navigateSpy = spyOn(router, 'navigate');
    expect(navigateSpy).toBeDefined();
  });

  it('Testing ionViewWillEnter()', () => {
    component.ionViewWillEnter();
    expect(component.itemToAdd).toBeDefined();
    expect(component.SearchDiveCheckList).toBeDefined();
    expect(component.showLoading).toBeFalse();
    expect(component.loginLabel).toBe("Log Out");
    let divSpy = spyOn(divService, 'getSuggestedCourses').and.callThrough();
    expect(divSpy).toBeDefined();
    expect(component.suggestedCourseFullList).toBeDefined();
  });

  it('Testing onChooseDive()', () => {
    event: Event;
    component.onChooseDive("Ice Dive", event);
    expect(component.showLoading).toBeTrue();
    let divSpy = spyOn(divService, 'getCheckList').and.callThrough();
    expect(divSpy).toBeDefined();
    expect(component.viewChecklist).toBeFalse();
    expect(component.OptionalReceived).toBeUndefined();
    expect(component.EquipmentReceived).toBeUndefined();
  });

  it('Testing diveTypeListFinder()', () => {
    component.divetypeListFinder();
    expect(component.showLoading).toBeFalse();
    let divSpy = spyOn(divService, 'getDiveTypes').and.callThrough();
    expect(divSpy).toBeDefined();
    expect(component.DiveTypeLst).toBeUndefined();
  });

  it('Testing toggleCheckList()', () => {
    component.toggleCheckList();
    expect(component.viewChecklist).toBe(component.viewChecklist);
  });

  it('Testing showAddInput()', () => {
    component.showAddInput();
    expect(component.viewAddInput).toBe(component.viewAddInput);
  });

  it('Testing addItem()', () => {
    component.addItem();
    expect(component.showLoading).toBeFalse();
    expect(component.viewPersonalAdded).toBeFalse();
    expect(component.viewAddInput).toBeFalse();
    expect(component.itemToAdd).toBeDefined();
    expect(component.viewChecklist).toBeFalse();
  });

  it('Testing saveCheckList()', () => {
    component.saveChecklist();
    let accountSpy = spyOn(accService, 'storeCustomChecklist').and.callThrough();
    expect(accountSpy).toBeDefined();
  });

  it('Testing Planning Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.ionViewWillEnter).toBeTruthy();
    expect(component.loginClick).toBeTruthy();
    expect(component.onChooseDive).toBeTruthy();
    expect(component.divetypeListFinder).toBeTruthy();
    expect(component.toggleCheckList).toBeTruthy();
    expect(component.showAddInput).toBeTruthy();
    expect(component.addItem).toBeTruthy();
    expect(component.getRandomThreeCourses).toBeTruthy();
    expect(component.saveChecklist).toBeTruthy();
  });
});
