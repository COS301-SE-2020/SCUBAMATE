import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { LogDivePage } from './log-dive.page';
import { AppModule } from '../app.module';
import { accountService } from '../service/account.service';
import { diveService } from '../service/dive.service';
import { weatherService } from '../service/weather.service';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

var validData = {
  pub: false,
  desc: "Saw Sharks",
  site: "Shark Alley",
  date: "2018-01-04",
  timeIn: "12:00",
  timeOut: "13:00",
  diveType: "Training Dive",
  buddy: "John Cena",
  vis: "13m",
  dep: "12m",
  aT: 12,
  surfaceT: 13,
  bottomT: 7,
  accessToken : "d1d7391d-c035-28ab-0193-68a7d263d4be11ac76afb3c161…0702085a1c423b0ed53f38b9a0e6e0ad8bfe8cd3712f14be7"
};

describe('LogDivePage', () => {
  let component: LogDivePage;
  let fixture: ComponentFixture<LogDivePage>;
  let accService: accountService;
  let divService: diveService;
  let weatService: weatherService;
  let http: HttpClient;
  let router; Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogDivePage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([]), AppModule],
      providers: [accountService, diveService, weatherService]
    }).compileComponents();

    fixture = TestBed.createComponent(LogDivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    accService = new accountService(http, router);
    divService = new diveService(http, router);
    weatService = new weatherService(http, router);
    router = TestBed.get(Router);
  }));

  it('Succesfully Created Log-Dive Page', () => {
    expect(component).toBeTruthy();
  });

  it('Testing Log-Dive Components', () => {
    expect(component.uuidValue).toBeDefined();
    expect(component.showLoading).toBeFalse();
    expect(component.DiveTypeLst).toBeUndefined();
    expect(component.DiveSiteLst).toBeDefined();
    expect(component.BuddyLst).toBeUndefined();
    expect(component.cDate).toBeDefined();
    expect(component.currentDate).toBeDefined();
    expect(component.MaxTempAPI).toBeUndefined();
    expect(component.MinTempAPI).toBeUndefined();
    expect(component.MoonPhase).toBeUndefined();
    expect(component.WeatherDescription).toBeUndefined();
    expect(component.WindSpeed).toBeUndefined();
    expect(component.Key).toBeDefined();
    expect(component.Coordinates).toBeDefined();
    expect(component.loginLabel).toBeDefined();
  });

  it('Testing ngOnInit()', () => {
    component.ngOnInit();
    expect(component.cDate).toBeInstanceOf(Date);
    expect(component.currentDate).toBeDefined();
    expect(component.showLoading).toBeTrue();
    expect(component.loginLabel).toBe("Log Out");
    let diveSpy = spyOn(divService, 'getDiveSites').and.callThrough();
    expect(diveSpy).toBeDefined();
    diveSpy = spyOn(divService, 'getDiveTypes').and.callThrough();
    expect(diveSpy).toBeDefined();
    let weatherSpy = spyOn(weatService, 'getLocationKey').and.callThrough();
    expect(weatherSpy).toBeDefined();
    weatherSpy = spyOn(weatService, 'getLogWeather').and.callThrough();
    expect(weatherSpy).toBeDefined();
    expect(component.DiveSiteLst).toBeDefined();
    expect(component.DiveTypeLst).toBeUndefined();
    expect(component.Coordinates).toBeDefined();
    expect(component.Key).toBeDefined();
    expect(component.MaxTempAPI).toBeUndefined();
    expect(component.MinTempAPI).toBeUndefined();
    expect(component.MoonPhase).toBeUndefined();
    expect(component.WeatherDescription).toBeUndefined();
    expect(component.WindSpeed).toBeUndefined();
    
  });

  it('Testing ionViewWillEnter()', () => {
    localStorage.setItem("accessToken", validData.accessToken);
    component.ionViewWillEnter();
    expect(component.loginLabel).toBe("Log Out");
  });

  it('Testing loginClick()', () => {
    localStorage.setItem("accessToken", validData.accessToken);
    let navigateSpy = spyOn(router, 'navigate');
    component.loginClick();
    expect(navigateSpy).toHaveBeenCalledWith(['home']);
  });

  it('Testing buddyListFinder()', () => {
    //component.buddyListFinder("John Cena");
    let accountSpy = spyOn(accService, 'lookAheadBuddy').and.callThrough();
    expect(accountSpy).toBeDefined();
    expect(component.BuddyLst).toBeUndefined();
    expect(component.showLoading).toBeTrue();
  });

  it('Testing DiveLogSubmit()', () => {
    let navigateSpy = spyOn(router, 'navigate');
    component.DiveLogSubmit();
    let diveSpy = spyOn(divService, 'logDive').and.callThrough();
    expect(diveSpy).toBeDefined();
    expect(component.showLoading).toBeTrue();
    expect(navigateSpy).toHaveBeenCalledWith(['my-dives']);
  }); 

  it('Testing Log-Dive Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.ionViewWillEnter).toBeTruthy();
    expect(component.loginClick).toBeTruthy();
    expect(component.DiveLogSubmit).toBeTruthy();
    expect(component.buddyListFinder).toBeTruthy();
  });
});
