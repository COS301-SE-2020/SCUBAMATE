import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '../app.module';
import { accountService } from '../service/account.service';
import { diveService } from '../service/dive.service';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { UpgradeInstructorPage } from './upgrade-instructor.page';

var accessToken = "d1d7391d-c035-28ab-0193-68a7d263d4be11ac76afb3c161…0702085a1c423b0ed53f38b9a0e6e0ad8bfe8cd3712f14be7";

describe('UpgradeInstructorPage', () => {
  let component: UpgradeInstructorPage;
  let fixture: ComponentFixture<UpgradeInstructorPage>;
  let accService: accountService;
  let divService: diveService;
  let http: HttpClient;
  let router; Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpgradeInstructorPage, RouterTestingModule.withRoutes([]), AppModule ],
      imports: [IonicModule.forRoot()],
      providers: [accountService, diveService]
    }).compileComponents();

    fixture = TestBed.createComponent(UpgradeInstructorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.get(Router);
    accService = new accountService(http, router);
    divService = new diveService(http, router);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Testing Weather Components', () => {
    expect(component.loginLabel).toBeDefined();
    expect(component.userForm).toBeDefined();
    expect(component.userObj).toBeDefined();
    expect(component.CenterLst).toBeDefined();
    expect(component.showLoading).toBeUndefined();
  });

  it('Testing loginClick()', () => {
    localStorage.setItem("accessToken", accessToken);
    let navigateSpy = spyOn(router, 'navigate');
    component.loginClick();
    expect(navigateSpy).toHaveBeenCalledWith(['home']);
    let weatherSpy = spyOn(accService, 'upgradeToInstructor').and.callThrough();
    expect(weatherSpy).toBeDefined();
  });

  it('Testing CenterListFinder()', () => {
    component.CenterListFinder("Shark Alley");
    let weatherSpy = spyOn(divService, 'getDiveCenters').and.callThrough();
    expect(weatherSpy).toBeDefined();
    expect(component.showLoading).toBeFalse();
  });

  it('Testing UpgradeSubmit()', () => {
    let navigateSpy = spyOn(router, 'navigate');
    component.UpgradeSubmit();
    let weatherSpy = spyOn(accService, 'upgradeToInstructor').and.callThrough();
    expect(weatherSpy).toBeDefined();
    expect(navigateSpy).toHaveBeenCalledWith(['profile']);
    expect(component.showLoading).toBeFalse();
  });

  it('Testing Weather Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.CenterListFinder).toBeTruthy();
    expect(component.loginClick).toBeTruthy();
    expect(component.UpgradeSubmit).toBeTruthy();
  });
});
