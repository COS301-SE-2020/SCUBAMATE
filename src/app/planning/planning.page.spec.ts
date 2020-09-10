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
import { map } from 'rxjs/operators';

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
    let divSpy = spyOn(divService, 'getSuggestedCourses').and.callThrough();
    expect(divSpy).toBeDefined();
    let response = divService.getSuggestedCourses().pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(divSpy).toBeDefined();
    expect(divService.getSuggestedCourses).toHaveBeenCalled();
  });

  it('getCustomCheckList() test', () => {
    let accountSpy = spyOn(accService, 'getCustomChecklist').and.callThrough();
    expect(accountSpy).toBeDefined();
    let response = accService.getCustomChecklist().pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(accountSpy).toBeDefined();
    expect(accService.getCustomChecklist).toHaveBeenCalled();
  });

  it('getCheckList() test', () => {
    var data = {
      DiveType: "Night Dive"
    };
    let divSpy = spyOn(divService, 'getCheckList').and.callThrough();
    expect(divSpy).toBeDefined();
    let response = divService.getCheckList(data).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(divSpy).toBeDefined();
    expect(divService.getCheckList).toHaveBeenCalledWith(data);
  });

  it('getDiveTypes() test', () => {
    let divSpy = spyOn(divService, 'getDiveTypes').and.callThrough();
    expect(divSpy).toBeDefined();
    let response = divService.getDiveTypes("Night").pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(divSpy).toBeDefined();
    expect(divService.getDiveTypes).toHaveBeenCalledWith("Night");
  });

  it('storeCustomChecklist() test', () => {
    var customList = {
      "AccessToken": accessToken,
      "Equipment": "" ,
      "Optional": "" , 
      "Custom" : ""
    };

    let accountSpy = spyOn(accService, 'storeCustomChecklist').and.callThrough();
    expect(accountSpy).toBeDefined();
    let response = accService.storeCustomChecklist(customList).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(accountSpy).toBeDefined();
    expect(accService.storeCustomChecklist).toHaveBeenCalledWith(customList);
  });

  it('sendCourseSurveyAnswers() test', () => {
    var answers ={
      "AccessToken": accessToken,
      "Q1" : "Answer1",
      "Q2" : "Answer2",
      "Q3" : "Answer3",
      "Q4" : "Answer4",
      "Q5" : "Answer5"
    };

    let divSpy = spyOn(divService, 'sendCourseSurveyAnswers').and.callThrough();
    expect(divSpy).toBeDefined();
    let response = divService.sendCourseSurveyAnswers(answers).pipe(
      map( res => res.body)
    );
    console.log(response.operator);
    expect(divSpy).toBeDefined();
    expect(divService.sendCourseSurveyAnswers).toHaveBeenCalledWith(answers);
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
    expect(component.suggestedCourseFullList).toBeDefined();
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
    expect(component.suggestedCourseFullList).toBeDefined();
  });

  it('Testing onChooseDive()', () => {
    event: Event;
    component.onChooseDive("Ice Dive", event);
    expect(component.showLoading).toBeTrue();
    expect(component.viewChecklist).toBeFalse();
    expect(component.OptionalReceived).toBeUndefined();
    expect(component.EquipmentReceived).toBeUndefined();
  });

  it('Testing diveTypeListFinder()', () => {
    component.divetypeListFinder();
    expect(component.showLoading).toBeFalse();
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
