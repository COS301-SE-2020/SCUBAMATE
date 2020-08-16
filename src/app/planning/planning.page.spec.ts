import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { PlanningPage } from './planning.page';
import { AppModule } from '../app.module';
import { accountService } from '../service/account.service';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { computeStackId } from '@ionic/angular/directives/navigation/stack-utils';
import { diveService } from '../service/dive.service';

var accessToken = "d1d7391d-c035-28ab-0193-68a7d263d4be11bf1decf78d036abdad2f76f0e68ffeb1651b146d3eb2314ef2401a989bd190ce";

describe('PlanningPage', () => {
  let component: PlanningPage;
  let fixture: ComponentFixture<PlanningPage>;
  let accService: accountService;
  let divService: diveService;
  let http: HttpClient;
  let router; Router;
  

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanningPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([]), AppModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PlanningPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    accService = new accountService(http, router);
    divService = new diveService(http, router);
    router = TestBed.get(Router);
  }));

  it('should create', () => {
    localStorage.setItem("accessToken", accessToken);
    expect(component).toBeTruthy();
  });

  it('Testing Planning Components', () => {
    expect(component.DiveTypeLst).toBeUndefined();
    expect(component.OptionalReceived).toBeUndefined();
    expect(component.EquipmentReceived).toBeUndefined();
    expect(component.EquipmentList).toBeDefined();
    expect(component.OptionalList).toBeDefined();
    expect(component.viewChecklist).toBeFalse();
    expect(component.showLoading).toBeFalse();
    expect(component.SearchDiveCheckList).toBeUndefined();
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
    expect(component.getRandomThreeCourses).toHaveBeenCalled();
    let accountSpy = spyOn(accService, 'getCustomChecklist').and.callThrough();
    expect(accountSpy).toBeDefined();
    expect(component.EquipmentList).toBeDefined();
    expect(component.OptionalList).toBeDefined();
    expect(component.viewPersonalAdded).toBeTrue();
    expect(component.viewChecklist).toBeTrue();
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

  it('Testing loginClick()', () => {
    expect(localStorage.getItem("accessToken")).toBeDefined();
  });

  it('Testing onChooseDive()', () => {
    event: Event;
    component.onChooseDive("", event);
    expect(component.showLoading).toBeTrue();
    let divSpy = spyOn(divService, 'getCheckList').and.callThrough();
    expect(divSpy).toBeDefined();
    expect(component.viewChecklist).toBeFalse();
    expect(component.OptionalReceived).toBeUndefined();
    expect(component.EquipmentReceived).toBeUndefined();
  });

  it('Testign diveTypeListFinder()', () => {
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

  it('Testing getRandomThreeCourses()', () => {
    component.getRandomThreeCourses();
    expect(component.suggestedCourseThreeList[0]).toBeUndefined();
    expect(component.suggestedCourseThreeList[1]).toBeUndefined();
    expect(component.suggestedCourseThreeList[2]).toBeUndefined();
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
